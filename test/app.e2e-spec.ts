import 'dotenv/config';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import request from 'supertest';

// Mock de uuid (module ESM) pour éviter l'erreur Jest sur l'import
jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));
import { execSync } from 'child_process';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';

describe('App e2e (auth + restaurants)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: any;
  let accessTokenOwner: string;
  let restaurantId: string;
  let categoryId: string;

  beforeAll(async () => {
    // Appliquer les migrations (sur la même base que l'appli de dev)
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: { ...process.env },
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configurer class-validator pour injecter PrismaService dans les validators custom
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    // Reproduire la configuration de main.ts (versioning, pipes, filters, interceptors)
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    app.useGlobalInterceptors(
      new LoggingInterceptor(),
      new TransformInterceptor(),
    );

    app.useGlobalFilters(new GlobalExceptionFilter());
    prisma = app.get(PrismaService);
    await app.init();
    server = app.getHttpServer();

    // Nettoyer les données et créer au moins une catégorie pour les tests
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
      const res = await request(server)
        .post('/v1/auth/register')
        .send({ email: 'owner@test.dev', password: 'secret123', role: 'owner' })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.access_token).toBeDefined();
    });

    it('POST /v1/auth/register (email dupliqué) → 409', async () => {
      await request(server)
        .post('/v1/auth/register')
        .send({ email: 'dup@test.dev', password: 'secret123' })
        .expect(201);

      const res = await request(server)
        .post('/v1/auth/register')
        .send({ email: 'dup@test.dev', password: 'secret123' })
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.error.statusCode).toBe(409);
    });

    it('POST /v1/auth/login (bon mot de passe) → 201', async () => {
      const res = await request(server)
        .post('/v1/auth/login')
        .send({ email: 'owner@test.dev', password: 'secret123' })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.access_token).toBeDefined();
      accessTokenOwner = res.body.data.access_token;
    });

    it('POST /v1/auth/login (mauvais mot de passe) → 401', async () => {
      const res = await request(server)
        .post('/v1/auth/login')
        .send({ email: 'owner@test.dev', password: 'wrongpass' })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error.statusCode).toBe(401);
    });
  });

  describe('Restaurants v2 protected flow', () => {
    it('POST /v2/restaurants SANS token → 401', async () => {
      const res = await request(server).post('/v2/restaurants').send({});

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.statusCode).toBe(401);
    });

    it('POST /v2/restaurants AVEC token owner → 201', async () => {
      const res = await request(server)
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
      const res = await request(server).get('/v2/restaurants').expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.data)).toBe(true);
      expect(res.body.data.data.length).toBeGreaterThan(0);
    });

    it('GET /v2/restaurants/:id existant → 200', async () => {
      const res = await request(server)
        .get(`/v2/restaurants/${restaurantId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(restaurantId);
    });

    it('GET /v2/restaurants/:id inexistant → 404', async () => {
      const res = await request(server)
        .get('/v2/restaurants/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error.statusCode).toBe(404);
      expect(res.body.error.path).toContain('/v2/restaurants/');
    });
  });
});

