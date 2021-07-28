import { Field, ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime';

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
  salary: Decimal;

  @Field(() => Number)
  rate: Decimal;

  @Field(() => Number)
  stepPremium: Decimal;

  @Field(() => Number)
  stepPremiumOther: Decimal;

  @Field(() => Number)
  premium: Decimal;

  @Field(() => Number)
  fineSum: Decimal;

  @Field(() => Number)
  premiumTotal: Decimal;
}
