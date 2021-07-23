import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity('spr_employees_role')
@ObjectType()
export class EmployeeRole {
  @PrimaryColumn()
  @Field(() => Int)
  id: number;

  @Column({ name: 'role_name' })
  @Field(() => String)
  name: string;
}
