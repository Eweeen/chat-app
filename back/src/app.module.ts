import { Module, UseFilters } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config.env',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),

    // !============================================================
    // !   DATABASE FOR THE APP IS DEFINED IN THE DATABASE MODULE
    // !============================================================
    DatabaseModule,
    AuthModule,
    UsersModule,
    ChatModule,
    WebsocketModule,
  ],
  providers: [UsersService, ChatService],
  exports: [UsersService, ChatService],
  controllers: [AppController],
})
@UseFilters(HttpExceptionFilter)
export class AppModule {}
