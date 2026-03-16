"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const class_validator_1 = require("class-validator");
const supertest_1 = __importDefault(require("supertest"));
jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));
const child_process_1 = require("child_process");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
const global_exception_filter_1 = require("../src/common/filters/global-exception.filter");
const transform_interceptor_1 = require("../src/common/interceptors/transform.interceptor");
const logging_interceptor_1 = require("../src/common/interceptors/logging.interceptor");
describe('App e2e (auth + restaurants)', () => {
    let app;
    let prisma;
    let server;
    let accessTokenOwner;
    let restaurantId;
    let categoryId;
    beforeAll(async () => {
        (0, child_process_1.execSync)('npx prisma migrate deploy', {
            stdio: 'inherit',
            env: { ...process.env },
        });
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
        app.enableVersioning({
            type: common_1.VersioningType.URI,
            defaultVersion: '1',
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }));
        app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new transform_interceptor_1.TransformInterceptor());
        app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
        prisma = app.get(prisma_service_1.PrismaService);
        await app.init();
        server = app.getHttpServer();
        await prisma.menuItem.deleteMany();
        await prisma.menu.deleteMany();
        await prisma.restaurant.deleteMany();
        await prisma.category.deleteMany();
        await prisma.user.deleteMany();
        const category = await prisma.category.create({
            data: { name: 'Tests' },
        });
        categoryId = category.id;
    });
    afterAll(async () => {
        await prisma.menuItem.deleteMany();
        await prisma.menu.deleteMany();
        await prisma.restaurant.deleteMany();
        await prisma.category.deleteMany();
        await prisma.user.deleteMany();
        await app.close();
    });
    describe('Auth flow', () => {
        it('POST /v1/auth/register (valide) → 201', async () => {
            const res = await (0, supertest_1.default)(server)
                .post('/v1/auth/register')
                .send({ email: 'owner@test.dev', password: 'secret123', role: 'owner' })
                .expect(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.access_token).toBeDefined();
        });
        it('POST /v1/auth/register (email dupliqué) → 409', async () => {
            await (0, supertest_1.default)(server)
                .post('/v1/auth/register')
                .send({ email: 'dup@test.dev', password: 'secret123' })
                .expect(201);
            const res = await (0, supertest_1.default)(server)
                .post('/v1/auth/register')
                .send({ email: 'dup@test.dev', password: 'secret123' })
                .expect(409);
            expect(res.body.success).toBe(false);
            expect(res.body.error.statusCode).toBe(409);
        });
        it('POST /v1/auth/login (bon mot de passe) → 201', async () => {
            const res = await (0, supertest_1.default)(server)
                .post('/v1/auth/login')
                .send({ email: 'owner@test.dev', password: 'secret123' })
                .expect(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.access_token).toBeDefined();
            accessTokenOwner = res.body.data.access_token;
        });
        it('POST /v1/auth/login (mauvais mot de passe) → 401', async () => {
            const res = await (0, supertest_1.default)(server)
                .post('/v1/auth/login')
                .send({ email: 'owner@test.dev', password: 'wrongpass' })
                .expect(401);
            expect(res.body.success).toBe(false);
            expect(res.body.error.statusCode).toBe(401);
        });
    });
    describe('Restaurants v2 protected flow', () => {
        it('POST /v2/restaurants SANS token → 401', async () => {
            const res = await (0, supertest_1.default)(server).post('/v2/restaurants').send({});
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.error.statusCode).toBe(401);
        });
        it('POST /v2/restaurants AVEC token owner → 201', async () => {
            const res = await (0, supertest_1.default)(server)
                .post('/v2/restaurants')
                .set('Authorization', `Bearer ${accessTokenOwner}`)
                .send({
                name: 'Chez E2E',
                address: {
                    street: '10 Rue Test',
                    city: 'Paris',
                    zipCode: '75001',
                    country: 'FR',
                },
                countryCode: '+33',
                localNumber: '612345678',
                cuisineType: 'ITALIAN',
                phone: '+33612345678',
                email: 'e2e@test.dev',
                averagePrice: 25,
                deliveryTime: 30,
                categoryIds: [categoryId],
            })
                .expect(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.id).toBeDefined();
            restaurantId = res.body.data.id;
        });
        it('GET /v2/restaurants → 200 + tableau non vide', async () => {
            const res = await (0, supertest_1.default)(server).get('/v2/restaurants').expect(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data.data)).toBe(true);
            expect(res.body.data.data.length).toBeGreaterThan(0);
        });
        it('GET /v2/restaurants/:id existant → 200', async () => {
            const res = await (0, supertest_1.default)(server)
                .get(`/v2/restaurants/${restaurantId}`)
                .expect(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.id).toBe(restaurantId);
        });
        it('GET /v2/restaurants/:id inexistant → 404', async () => {
            const res = await (0, supertest_1.default)(server)
                .get('/v2/restaurants/00000000-0000-0000-0000-000000000000')
                .expect(404);
            expect(res.body.success).toBe(false);
            expect(res.body.error.statusCode).toBe(404);
            expect(res.body.error.path).toContain('/v2/restaurants/');
        });
    });
});
//# sourceMappingURL=app.e2e-spec.js.map