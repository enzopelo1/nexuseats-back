import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permet d'injecter des dépendances (ex: PrismaService) dans les custom validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors();

  // Compression gzip globale
  app.use(
    compression({
      threshold: 0, // compresse toutes les réponses, même petites
      level: 6,
      filter: () => true, // force la compression même si le client n'envoie pas de hint particulier
    }),
  );

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

  // Intercepteurs globaux (logging + format de réponse)
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Filtre d'exception global
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('NexusEats API')
    .setDescription('API de livraison de repas NexusEats - Documentation complète des endpoints pour la gestion des restaurants')
    .setVersion('1.0')
    .addTag('restaurants', 'Endpoints pour la gestion des restaurants (CRUD complet)')
    .addTag('auth', 'Inscription, connexion et profil (JWT)')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', in: 'header' }, 'JWT')
    .setContact(
      'Équipe NexusEats',
      'https://nexuseats.com',
      'support@nexuseats.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
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
