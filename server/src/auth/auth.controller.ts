import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user/register-user.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';
import { LoginUserDto } from './dto/login-user/login-user.dto';
import { RefreshJwtAuthGuard } from './guards/refresh-auth.guard';
import type { RefreshTokenStratergyReqParameters } from './types/auth-jwt.payload';
import { RefreshTokensDto } from './dto/refresh-tokens/refresh-tokens.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiCreatedResponse({ type: BaseResponseDto<RegisterUserDto> })
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res() reply: FastifyReply,
  ): Promise<BaseResponseDto<RegisterUserDto>> {
    const createUser = await this.authService.registerUser(registerUserDto);

    const tokens = this.authService.generateTokens(createUser.id);

    return reply.status(HttpStatus.CREATED).send({
      success: true,
      message: 'User created successfully',
      user: createUser,
      tokens,
    });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginUserDto })
  @ApiCreatedResponse({ type: BaseResponseDto<LoginUserDto> })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() reply: FastifyReply,
  ): Promise<BaseResponseDto<RegisterUserDto>> {
    const user = await this.authService.validateUser(loginUserDto);

    const tokens = this.authService.generateTokens(user.id);

    return reply.status(HttpStatus.CREATED).send({
      success: true,
      message: 'User created successfully',
      user,
      tokens,
    });
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh Tokens',
    description:
      'Here After sending authenticated refresh token in body, bot access and refesh token will be generated',
  })
  @ApiBody({ type: RefreshTokensDto })
  refreshTokens(@Req() req: RefreshTokenStratergyReqParameters) {
    return this.authService.refreshTokens({
      userId: req.user.id,
      refreshToken: req.user.refreshToken,
      expiredAt: req.user.expiredAt,
      createdAt: req.user.issuedAt,
    });
  }
}
