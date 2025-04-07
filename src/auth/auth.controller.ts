import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { SendOtpDto } from './dto/sendotp';
import {
  LoginDto,
  RegisterDto,
  VerifyOtpDto,
} from './dto/login.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
// import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Emailga OTP jonatish' })
  @ApiResponse({ status: 200, description: 'OTP yuborildi' })
  @ApiResponse({ status: 400, description: 'Email notogri' })
  @ApiBody({ type: SendOtpDto })
  async sendOtp(@Body('email') email: string) {
    return this.authService.sendOtp(email);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'OTP kodni tekshirish' })
  @ApiResponse({ status: 200, description: 'OTP tasdiqlandi' })
  @ApiResponse({ status: 400, description: 'Notogri OTP' })
  async verifyOtp(@Body() data: VerifyOtpDto) {
    return this.authService.verifyOtp(data.email, data.otp);
  }

  @Post('register')
  @ApiOperation({ summary: 'Foydalanuvchini royxatdan otkazish' })
  @ApiResponse({ status: 201, description: 'Royxatdan otish muvaffaqiyatli' })
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login va session saqlash' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli login' })
  @ApiResponse({ status: 401, description: 'Email yoki parol notogri' })
  async login(@Body() data: LoginDto, @Req() req: any) {
    return this.authService.login(data, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Profilni olish (JWT orqali)' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  @ApiOperation({ summary: 'User sessiyalarini korish' })
  async getSessions(@Request() req) {
    return this.authService.getSessions(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Aktiv sessionni ochirish' })
  async logout(@Request() req) {
    return this.authService.logout(req.user.id, req);
  }
}

