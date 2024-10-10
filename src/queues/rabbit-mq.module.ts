import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbit-mq.service';
import { RabbitMQController } from './rabbit-mq.controller';
import { Edge } from 'src/edges/entities/edge.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
@Module({
   imports: [
      TypeOrmModule.forFeature([Edge]), 
      ClientsModule.registerAsync([
         {
            name: 'rabbit-mq-module',
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
               const rabbitMQHost = configService.get<string>('RABBITMQ_HOST');
               const rabbitMQPort = configService.get<string>('RABBITMQ_PORT');
               const rabbitMQUser = configService.get<string>('RABBITMQ_USER');
               const rabbitMQPassword = configService.get<string>('RABBITMQ_PASSWORD');

               return {
                  transport: Transport.RMQ,
                  options: {
                     urls: [`amqp://${rabbitMQUser}:${rabbitMQPassword}@${rabbitMQHost}:${rabbitMQPort}`],
                     queue: configService.get<string>('RABBITMQ_QUEUE'),
                     queueOptions: {
                        durable: true
                     },
                  },
               };
            },
         }
      ]),
   ],
   controllers: [RabbitMQController],
   providers: [RabbitMQService],
   exports: [RabbitMQService],
})
export class RabbitMQModule { }