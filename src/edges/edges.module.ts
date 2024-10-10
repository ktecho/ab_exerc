import { Module } from '@nestjs/common';
import { EdgesService } from './edges.service';
import { EdgesResolver } from './edges.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from './entities/edge.entity';
import { RabbitMQModule } from 'src/queues/rabbit-mq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Edge]),
    RabbitMQModule
  ],
  providers: [EdgesResolver, EdgesService],
})
export class EdgesModule {}
