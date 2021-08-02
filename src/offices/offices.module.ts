import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OfficesResolver } from './offices.resolver';
import { OfficesService } from './offices.service';

@Module({
  imports: [PrismaModule],
  providers: [OfficesResolver, OfficesService],
})
export class OfficesModule {}
