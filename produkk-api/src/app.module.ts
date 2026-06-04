import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
