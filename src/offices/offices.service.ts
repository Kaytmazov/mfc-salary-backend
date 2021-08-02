import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Office } from './entities/office.entity';

@Injectable()
export class OfficesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllOffices(): Promise<Office[]> {
    try {
      const data = await this.prisma.spr_employees_mfc.findMany({
        select: {
          id: true,
          mfc_name: true,
        },
        orderBy: { mfc_name: 'asc' },
      });

      if (!data) {
        return [];
      }

      const offices = data.map(({ id, mfc_name }) => ({
        id,
        name: mfc_name,
      }));

      return offices;
    } catch {
      throw new InternalServerErrorException(
        'Не удалось выполнить запрос на получение списка офисов. Попробуйте еще раз.',
      );
    }
  }
}
