import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsString } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { EmployeeOffice } from './employee-office.entity';
import { EmployeeRole } from './role.entity';

// временно
export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Delivery = 'Delivery',
}

registerEnumType(UserRole, { name: 'UserRole' });

@Entity('spr_employees')
@InputType('EmployeeInputType', { isAbstract: true })
@ObjectType()
export class Employee {
  @PrimaryColumn()
  @Field(() => String)
  id: string;

  @Column({ name: 'employee_login', unique: true })
  @Field(() => String)
  @IsString()
  login: string;

  @Column({ name: 'employee_pass', select: false })
  @Field(() => String)
  @IsString()
  password: string;

  @Column({ name: 'employee_fio' })
  @Field(() => String)
  @IsString()
  fio: string;

  // @Column({ type: 'enum', enum: UserRole })
  // @Field(() => UserRole)
  // @IsEnum(UserRole)
  // role: UserRole;

  @ManyToMany(() => EmployeeRole)
  @JoinTable({
    name: 'spr_employees_role_join',
    joinColumn: {
      name: 'spr_employees_mfc_join_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'spr_employees_role_id',
      referencedColumnName: 'id',
    },
  })
  @Field(() => [EmployeeRole], { nullable: true })
  roles?: EmployeeRole[];

  @ManyToMany(() => EmployeeOffice)
  @JoinTable({
    name: 'spr_employees_mfc_join',
    joinColumn: {
      name: 'spr_employees_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'spr_employees_mfc_id',
      referencedColumnName: 'id',
    },
  })
  @Field(() => [EmployeeOffice], { nullable: true })
  offices?: EmployeeOffice[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      // временно
      return true;
      // return bcrypt.compare(aPassword, this.password);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
