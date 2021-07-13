import { Field, Int } from '@nestjs/graphql';

export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;
}

export class PaginationOutput {
  @Field(() => Int, { nullable: true })
  totalPages?: number;
}
