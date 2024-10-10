import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Edge } from 'src/edges/entities/edge.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RabbitMQService {
   constructor(
      @Inject('rabbit-mq-module') private readonly client: ClientProxy,

      @InjectRepository(Edge)
      private readonly edgesRepository: Repository<Edge>,
   ) { }
   public send(pattern: string, data: any) {
      return this.client.send(pattern, data).toPromise();
   }
   public async processEdge(edge: Edge) {
      console.log(`New channel between [${edge.node1_alias}] and [${edge.node2_alias}] with a capacity of [${edge.capacity}] has been created.`)

      edge.node1_alias = `[${edge.node1_alias}]-updated`;
      edge.node2_alias = `[${edge.node2_alias}]-updated`;

      await this.edgesRepository.update(edge.id, edge);
   }
}