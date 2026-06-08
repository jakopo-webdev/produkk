import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = config.get<string>('NODE_ENV') || '';
        const host = nodeEnv.startsWith('prod') ? 'db' : 'localhost';
        const user = config.get<string>('POSTGRES_USER') || 'username';
        const pass = config.get<string>('POSTGRES_PASSWORD') || 'password';
        const db = config.get<string>('POSTGRES_DB') || 'produkk';
        const url = `postgresql://${user}:${pass}@${host}:5432/${db}`;

        return {
          type: 'postgres',
          url,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
    TasksModule,
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const nodeEnv = cfg.get<string>('NODE_ENV') || '';
        const host = nodeEnv.startsWith('prod') ? 'redis' : 'localhost';
        const port = Number(cfg.get<number>('REDIS_PORT') || 6379);

        return {
          type: 'single',
          url: `redis://${host}:${port}`,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
