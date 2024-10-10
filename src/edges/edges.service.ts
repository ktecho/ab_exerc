import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from './entities/edge.entity';
import { RabbitMQService } from 'src/queues/rabbit-mq.service';

@Injectable()
export class EdgesService {
  constructor(
    @InjectRepository(Edge)
    private readonly edgesRepository: Repository<Edge>,
    private readonly rabbitMQService: RabbitMQService,
  ) { }

  findAll() {
    return this.edgesRepository.find();
  }

  findOne(id: string) {
    return this.edgesRepository.findOne({ where: { id } });
  }

  async create(node1_alias: string, node2_alias: string): Promise<Edge> {
    const minCapacity: number = 10000;
    const maxCapacity: number = 1000000;
    const randomCapacity: number = Math.floor(Math.random() * (maxCapacity - minCapacity + 1)) + minCapacity;

    const edge: Edge = this.edgesRepository.create(
      {
        capacity: randomCapacity,
        node1_alias,
        node2_alias
      }
    );

    const savedEdge: Edge = await this.edgesRepository.save(edge);

    this.rabbitMQService.send('new-edge-queue', {
      edge: savedEdge
    }).catch(error => {
      console.error('Error while sending message to RabbitMQ:', error);
    });

    return savedEdge;
  }

  update(id: string, edge: Edge) {
    return this.edgesRepository.update(id, edge);
  }
}
