"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const compression_1 = __importDefault(require("compression"));
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    app.enableCors();
    app.use((0, compression_1.default)({
        threshold: 0,
        level: 6,
        filter: () => true,
    }));
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
    const config = new swagger_1.DocumentBuilder()
        .setTitle('NexusEats API')
        .setDescription('API de livraison de repas NexusEats — documentation complète pour les équipes web & mobile (auth, restaurants, commandes).')
        .setVersion('1.0')
        .addTag('auth', 'Inscription, connexion et profil (JWT)')
        .addTag('restaurants', 'Endpoints pour la gestion des restaurants (CRUD complet)')
        .addTag('orders', 'Endpoints pour la gestion des commandes via API Gateway')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
    }, 'JWT')
        .setContact('Équipe NexusEats', 'https://nexuseats.com', 'support@nexuseats.com')
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document, {
        customSiteTitle: 'NexusEats API Documentation',
        customfavIcon: 'https://nestjs.com/img/logo-small.svg',
        customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { font-size: 36px }
    `,
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            filter: true,
            showExtensions: true,
            showCommonExtensions: true,
        },
    });
    const port = process.env.PORT || 3002;
    await app.listen(port);
    console.log(`\n🚀 Application démarrée sur: http://localhost:${port}`);
    console.log(`📚 Documentation Swagger disponible sur: http://localhost:${port}/api-docs\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map