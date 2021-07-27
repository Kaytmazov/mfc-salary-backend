import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReportSalaryTotal {
  @Field(() => String)
  id: string;

  @Field(() => String)
  fio: string;

  @Field(() => String)
  jobPosition: string;

  @Field(() => String)
  type: string;

  @Field(() => Number)
  countDaysPeriod: number;

  @Field(() => Number)
  salary: number;

  @Field(() => Number)
  rate: number;

  @Field(() => Number)
  stepPremium: number;

  @Field(() => Number)
  stepPremiumOther: number;

  @Field(() => Number)
  fineSum: number;

  @Field(() => Number)
  premiumTotal: number;
}
