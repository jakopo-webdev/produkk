import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Request() req) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Request() req) {
    const { jti, exp } = req.user || {};
    return this.authService.logout(jti, exp);
  }
}
