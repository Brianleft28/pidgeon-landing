import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AdminModule } from "./admin/admin.module";
import { ChatModule } from "./chat/chat.module";
import { ContactModule } from "./contact/contact.module";
import { AppThrottlerModule } from "./throttler/throttler.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AdminModule,
    AppThrottlerModule,
    ChatModule,
    ContactModule,
  ],
})
export class AppModule {}
