/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  //Creating Api Function
  async signup() {
    return { message: 'user is added' };
  }

  async signin() {
    return '';
  }

  async signout() {
    return '';
  }
}
