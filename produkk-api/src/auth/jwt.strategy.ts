import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import type { Redis } from 'ioredis';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, @InjectRedis() private readonly redis: Redis) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: { sub: number; username: string; jti?: string; exp?: number }) {
    const jti = payload.jti;
    if (jti) {
      const revoked = await this.redis.get(`revoked:${jti}`);
      if (revoked) throw new UnauthorizedException('Token revoked');
    }
    return { userId: payload.sub, username: payload.username, jti: payload.jti, exp: payload.exp };
  }
}






