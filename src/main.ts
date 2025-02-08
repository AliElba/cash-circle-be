import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CircleStatus, MemberStatus, PaymentStatus } from '@prisma/client';

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
    origin: 'http://localhost:8100', // Frontend URL
    credentials: true, // Allow cookies if needed
  });

  // Enable Swagger and generate documentation
  const config = new DocumentBuilder()
    .setTitle('CashCircle API')
    .setDescription('API documentation for CashCircle - http://localhost:3000/api/docs-json')
    .setVersion('1.0')
    .addBearerAuth() // If using JWT authentication
    .addTag('CashCircle') // Group endpoints by tag in the Swagger UI documentation (optional)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (document?.components?.schemas) {
    // ✅ Ensure OpenAPI registers the Enums globally
    document.components.schemas['CircleStatus'] = {
      type: 'string',
      enum: Object.values(CircleStatus),
    };
    document.components.schemas['MemberStatus'] = {
      type: 'string',
      enum: Object.values(MemberStatus),
    };
    document.components.schemas['PaymentStatus'] = {
      type: 'string',
      enum: Object.values(PaymentStatus),
    };
  }

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().then(() => console.log('Application is running'));
