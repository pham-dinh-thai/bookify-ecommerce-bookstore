import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './shared/domain/exception/global-exception.filter';
import { BadRequestDomainException } from './shared/domain/exception/domain.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((e) => Object.values(e.constraints ?? {}).join(', '))
          .join('; ');
        return new BadRequestDomainException(messages, 'VALIDATION_ERROR');
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  const PORT = process.env.PORT || 3000;

  const logger = new Logger('Bootstrap');
  await app.listen(PORT, () => {
    logger.log(`Running API on port ${PORT}`);
  });
}
bootstrap();
