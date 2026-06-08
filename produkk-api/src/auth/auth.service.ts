import { ConflictException, Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import type { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByusername(dto.username);
    if (existing) {
      throw new ConflictException('username already in use');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.usersService.create(dto.username, hashedPassword);
    return { message: 'Registered successfully' };
  }

  async login(dto: LoginDto) {
    const rlKey = `rl:login:${dto.username}`;
    const attempts = await this.redis.incr(rlKey);
    if (attempts === 1) {
      await this.redis.expire(rlKey, 60 * 15); // 15 minutes
    }
    if (attempts > 10) {
      throw new HttpException('Too many login attempts, try later', HttpStatus.TOO_MANY_REQUESTS);
    }

    const user = await this.usersService.findByusername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // successful login — clear rate limiter
    await this.redis.del(rlKey);

    const jti = randomUUID();
    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload, { jwtid: jti });
    return { access_token: token };
  }

  async logout(jti: string, exp?: number) {
    if (!jti) return { message: 'No token id provided' };
    // compute TTL from exp claim if provided
    let ttl = 60 * 60; // default 1h
    if (exp) {
      const now = Math.floor(Date.now() / 1000);
      ttl = Math.max(0, exp - now);
    } else {
      const cfg = this.config.get<string>('JWT_EXPIRES_IN');
      // try parse numeric seconds
      const parsed = Number(cfg);
      if (!Number.isNaN(parsed)) ttl = parsed;
    }
    await this.redis.set(`revoked:${jti}`, '1', 'EX', ttl);
    return { message: 'Logged out' };
  }
}
