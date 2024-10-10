import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const rabbitMQHost = configService.get<string>('RABBITMQ_HOST');
  const rabbitMQPort = configService.get<string>('RABBITMQ_PORT');
  const rabbitMQUser = configService.get<string>('RABBITMQ_USER');
  const rabbitMQPassword = configService.get<string>('RABBITMQ_PASSWORD');
  const rabbitMQQueue = configService.get<string>('RABBITMQ_QUEUE');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${rabbitMQUser}:${rabbitMQPassword}@${rabbitMQHost}:${rabbitMQPort}`],
      queue: rabbitMQQueue,
      queueOptions: {
        durable: true
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
