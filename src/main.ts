import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().then(() => console.log('Application is running'));
