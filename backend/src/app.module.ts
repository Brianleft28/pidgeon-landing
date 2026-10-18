import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from "./chat/chat.module";
import { ContactModule } from "./contact/contact.module";
import { AppThrottlerModule } from './throttler/throttler.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppThrottlerModule,
    ChatModule,
    ContactModule,
  ],
})
export class AppModule {}

