import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CircleStatus, MemberStatus, PaymentStatus } from '@prisma/client';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global validation pipe to automatically validate incoming requests against the DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    })
  );

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:8100', 'https://cash-circle.vercel.app/'], // Frontend URL
    credentials: true, // Allow cookies if needed
  });

  swaggerInit(app);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().then(() => console.log('Application is running'));

/**
 * Initialize Swagger for the application.
 *
 * The OpenAPI specification is generated automatically by NestJS based on the
 * controllers, services, and DTOs defined in the application.
 *
 * This method is responsible for setting up Swagger documentation for the application.
 * It enables Swagger and automatically generates documentation based on the application's controllers, services, and DTOs.
 * The generated documentation is available at /api/docs and can be accessed with the Swagger UI.
 *
 * @param app - The NestJS application.
 */
const swaggerInit = (app: INestApplication<any>) => {
  // Enable Swagger and generate documentation
  const config = new DocumentBuilder()
    .setTitle('CashCircle API')
    .setDescription('API documentation for CashCircle - /api/docs-json')
    .setVersion('1.0')
    .addBearerAuth() // If using JWT authentication
    .addTag('CashCircle') // Group endpoints by tag in the Swagger UI documentation (optional)
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, config);

  if (!swaggerDocument?.components?.schemas) {
    return;
  }

  // Ensure OpenAPI registers the Enums globally
  swaggerDocument.components.schemas['CircleStatus'] = {
    type: 'string',
    enum: Object.values(CircleStatus),
    description: 'Circle status',
  };
  swaggerDocument.components.schemas['MemberStatus'] = {
    type: 'string',
    enum: Object.values(MemberStatus),
    description: 'Member status',
  };
  swaggerDocument.components.schemas['PaymentStatus'] = {
    type: 'string',
    enum: Object.values(PaymentStatus),
    description: 'Payment status',
  };

  // Serve static files for Swagger UI
  app.use('/swagger-static', express.static(join(__dirname, '../node_modules/swagger-ui-dist')));

  // Set up Swagger UI to display the generated documentation
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    swaggerOptions: {
      url: '/api/docs-json', // Ensure it loads the correct JSON
    },
  });
};
