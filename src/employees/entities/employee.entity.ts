import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { EmployeeOffice } from './employee-office.entity';

// временно
export enum UserRole {
  SuperAdmin = 'super_admin',
  ExpertMfc = 'expert_umfc',
  Specialist = 'specialist',
  Operator = 'operator',
  Guest = 'guest',
  AdministratorMfc = 'administrator_mfc',
  Courier = 'courier',
  Lawyer = 'lawyer',
  CadastralEngineer = 'cadastral_engineer',
  BranchManager = 'branch_manager',
  HumanResourcesUmfc = 'human_resources_umfc',
  LawyerUmfc = 'lawyer_umfc',
  SeniorOperator = 'senior_operator',
  ChiefOfOz = 'chief_of_oz',
  SeniorSpecialist = 'senior_specialist',
  ChiefOfEo = 'chief_of_eo',
  SubsidySpecialist = 'subsidy_specialist',
  EconomistUmfc = 'economist_umfc',
  СourierProcessed = 'сourier_processed',
  CourierRemoteWorkplace = 'courier_remote_workplace',
  Support = 'support',
  Clerk = 'clerk',
  SocialSpecialist = 'social_specialist',
}

@InputType('EmployeeInputType', { isAbstract: true })
@ObjectType()
export class Employee {
  @Field(() => String)
  id: string;

  @Field(() => String)
  login: string;

  @Field(() => String)
  fio: string;

  @Field(() => EmployeeOffice, { nullable: true })
  office?: EmployeeOffice;

  @Field(() => String, { nullable: true })
  jobPosition?: string;

  @Field(() => String, { nullable: true })
  role?: string;
}
