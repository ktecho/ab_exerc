import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { RabbitMQService } from 'src/queues/rabbit-mq.service';

@Controller()
export class RabbitMQController {
   constructor(private readonly rabbitMQService: RabbitMQService) { }

   @EventPattern('new-edge-queue')
   async handleNewEdgeMessage(data: any) {
      if (data && data.edge) {
         await this.rabbitMQService.processEdge(data.edge);
      } else {
         console.error('There is no edge in the message received from the queue');
      }
   }
}