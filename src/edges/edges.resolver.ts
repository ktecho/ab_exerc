import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EdgesService } from './edges.service';
import { Edge } from './entities/edge.entity';

@Resolver(() => Edge)
export class EdgesResolver {
  constructor(private readonly edgesService: EdgesService) { }

  @Query(() => [Edge])
  getEdges() {
    return this.edgesService.findAll();
  }

  @Query(() => Edge)
  getEdge(@Args('id') id: string) {
    return this.edgesService.findOne(id);
  }

  @Mutation(() => Edge)
  createEdge(@Args('node1_alias') node1_alias: string, @Args('node2_alias') node2_alias: string) {
    return this.edgesService.create(node1_alias, node2_alias);
  }
}
