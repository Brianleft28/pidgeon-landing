import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { ThrottlerStorageRedisService } from "./throttler-storage-redis.service";

const redisStorage = new ThrottlerStorageRedisService();

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: "chat",
          ttl: 3600000, // 1 hora en ms
          limit: 20, // 20 consultas por IP por hora (admins exentos via skipIf)
        },
      ],
      skipIf: (context) => {
        const req = context.switchToHttp().getRequest();
        const adminHeader = req?.headers?.["x-admin-token"];
        const cookieHeader = String(req?.headers?.["cookie"] || "");
        return Boolean(
          (typeof adminHeader === "string" && adminHeader.includes(".")) ||
            cookieHeader.includes("pidgeon_admin_token="),
        );
      },
      storage: redisStorage,
    }),
  ],
  providers: [
    {
      provide: ThrottlerStorageRedisService,
      useValue: redisStorage,
    },
  ],
  exports: [ThrottlerModule],
})
export class AppThrottlerModule {}
