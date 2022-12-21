/* eslint-disable @typescript-eslint/no-empty-function */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto, AutgDtosigin } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './utils/constant';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  //Creating Api Function
  //Signup services
  async signup(dto: AuthDto) {
    const { email, password, name } = dto;
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (foundUser) {
      throw new BadRequestException('Email is already register');
    }
    const hashedPassword = await this.hashedPassword(password);
    await this.prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });
    return { message: 'Signup successfully ' };
  }
  //signin service
  async signin(dto: AutgDtosigin, req: Request, res: Response) {
    const { email, password } = dto;
    const foundUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!foundUser) {
      throw new BadRequestException('Wrong email');
    }

    const isMatch = await this.comparePassword({
      password,
      hash: foundUser.hashedPassword,
    });

    if (!isMatch) {
      throw new BadRequestException('password doesnt match');
    }

    //sign in jwt and return to user
    const token = await this.signToken({
      id: foundUser.id,
      email: foundUser.email,
    });

    if (!token) {
      throw new ForbiddenException();
    }

    res.cookie('token', token);
    return res.send({ message: 'Login Successfully' });
  }
  //signout service
  async signout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logout Successfully' });
  }

  async hashedPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePassword(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { id: number; email: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, { secret: jwtConstants });
  }
}
