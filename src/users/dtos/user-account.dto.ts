import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ArgsType()
export class UserAccountInput {
  @Field(() => String)
  userId: string;
}

@ObjectType()
export class UserAccountOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
