import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUser() {
    return this.usersService.getUser();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUsersId(@Param() params: { id: number }) {
    return this.usersService.getUserById(params.id);
  }
}
