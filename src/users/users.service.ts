import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser() {
    // eslint-disable-next-line prettier/prettier
    return await this.prisma.user.findMany({select:{id:true,email:true,name:true}});
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return { user };
  }
}
