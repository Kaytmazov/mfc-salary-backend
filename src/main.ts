import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: ([error]: ValidationError[]) => {
        const [errorMsg] = Object.values(error.constraints);

        return new BadRequestException(errorMsg);
      },
      forbidUnknownValues: false,
    }),
  );
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
