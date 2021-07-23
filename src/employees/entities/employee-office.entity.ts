import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity('spr_employees_mfc')
@ObjectType()
export class EmployeeOffice {
  @PrimaryColumn()
  @Field(() => String)
  id: string;

  @Column({ name: 'mfc_name' })
  @Field(() => String)
  name: string;
}
