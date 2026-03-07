import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
import { ChatModule } from "./chat/chat.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_DATABASE || "pidgeon_db",
      entities: [__dirname + "/db/entities/*{.ts,.js}"],
      migrations: [__dirname + "/db/migrations/*{.ts,.js}"],
      synchronize: process.env.TYPEORM_SYNC === "true",
      logging: false,
    }),
    AuthModule,
    MercadoPagoModule,
    ChatModule,
  ],
})
export class AppModule {}
