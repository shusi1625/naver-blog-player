import { Redis } from "@upstash/redis";
import type { WidgetData } from "@/types/widget";
import { getWidgetDataCacheSeconds, readOptionalEnv } from "@/lib/env";

const WIDGET_KEY = "widget:top-tracks";

let memoryData: WidgetData | null = null;
let memoryDataExpiresAt = 0;
let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) {
    return redisClient;
  }

  const url = readOptionalEnv("UPSTASH_REDIS_REST_URL");
  const token = readOptionalEnv("UPSTASH_REDIS_REST_TOKEN");

  redisClient = url && token ? new Redis({ url, token }) : null;
  return redisClient;
}

export async function getWidgetData(): Promise<WidgetData | null> {
  const redis = getRedis();

  if (!redis) {
    return memoryData;
  }

  if (memoryData && Date.now() < memoryDataExpiresAt) {
    return memoryData;
  }

  const data = await redis.get<WidgetData>(WIDGET_KEY);
  memoryData = data;
  memoryDataExpiresAt = Date.now() + getWidgetDataCacheSeconds() * 1000;

  return data;
}

export async function setWidgetData(data: WidgetData): Promise<void> {
  const redis = getRedis();

  if (!redis) {
    memoryData = data;
    memoryDataExpiresAt = Number.POSITIVE_INFINITY;
    return;
  }

  await redis.set(WIDGET_KEY, data);
  memoryData = data;
  memoryDataExpiresAt = Date.now() + getWidgetDataCacheSeconds() * 1000;
}
