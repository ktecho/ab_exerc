import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Edge {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @CreateDateColumn({
    transformer: {
      to: (value: Date) => value,
      from: (value: Date) => value.toISOString(),
    },
  })
  @Field(() => String)
  created_at: Date;

  @UpdateDateColumn({
    transformer: {
      to: (value: Date) => value,
      from: (value: Date) => value.toISOString(),
    },
  })
  @Field(() => String)
  updated_at: Date;

  @Column('int')
  @Field(() => Int)
  capacity: number;

  @Column()
  @Field()
  node1_alias: string;

  @Column()
  @Field()
  node2_alias: string;

  @Field()
  get edge_peers(): string {
    return `[${this.node1_alias}]-[${this.node2_alias}]`;
  }
}
