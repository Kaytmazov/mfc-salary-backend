import { Resolver, Query } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { Office } from './entities/office.entity';
import { OfficesService } from './offices.service';

@Resolver(() => Office)
export class OfficesResolver {
  constructor(private readonly officesService: OfficesService) {}

  @Query(() => [Office])
  @Role(['Any'])
  allOffices(): Promise<Office[]> {
    return this.officesService.getAllOffices();
  }
}
