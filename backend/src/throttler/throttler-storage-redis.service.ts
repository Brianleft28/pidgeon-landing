import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import Redis from 'ioredis';

@Injectable()
export class ThrottlerStorageRedisService implements ThrottlerStorage, OnModuleDestroy {
  private readonly logger = new Logger(ThrottlerStorageRedisService.name);
  private client: Redis;

  constructor() {
    const redisHost = process.env.REDIS_HOST || 'redis';
    const redisPort = Number(process.env.REDIS_PORT) || 6379;

    this.client = new Redis({
      host: redisHost,
      port: redisPort,
      lazyConnect: true,
      maxRetriesPerRequest: 2,
    });

    this.client.on('connect', () => {
      this.logger.log(`Connected to Redis at ${redisHost}:${redisPort}`);
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis connection error', err.message);
    });
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<{ totalHits: number; timeToExpire: number; isBlocked: boolean; timeToBlockExpire: number }> {
    const redisKey = `pidgeon:throttle:${throttlerName}:${key}`;
    const ttlSeconds = Math.floor(ttl / 1000);

    try {
      const pipeline = this.client.pipeline();
      pipeline.incr(redisKey);
      pipeline.ttl(redisKey);
      const results = await pipeline.exec();

      const totalHits = (results?.[0]?.[1] as number) || 1;
      const currentTtl = (results?.[1]?.[1] as number) || -1;

      if (totalHits === 1 || currentTtl === -1) {
        await this.client.expire(redisKey, ttlSeconds);
      }

      const timeToExpire = currentTtl > 0 ? currentTtl * 1000 : ttl;
      const isBlocked = totalHits > limit;

      return {
        totalHits,
        timeToExpire,
        isBlocked,
        timeToBlockExpire: isBlocked ? timeToExpire : 0,
      };
    } catch (err: any) {
      // Fail-open: si Redis no está disponible temporalmente, no bloquear el chat
      this.logger.warn(`Redis throttle fallback (fail-open): ${err?.message || err}`);
      return {
        totalHits: 1,
        timeToExpire: ttl,
        isBlocked: false,
        timeToBlockExpire: 0,
      };
    }
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}
