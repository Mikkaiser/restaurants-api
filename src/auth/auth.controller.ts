import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from './schemas/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) : Promise<{ token: string }> {
    return await this.authService.signUp(signUpDto);
  }

  @Get('login')
  async login(@Body() loginDto: LoginDto) : Promise<{ token: string }> {
    return await this.authService.login(loginDto);
  }
  
}