import type { TimeRange } from "@/types/widget";

export class EnvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvError";
  }
}

export function readRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new EnvError(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function readOptionalEnv(name: string): string | undefined {
  return process.env[name] || undefined;
}

export function getWidgetTitle(): string {
  return readOptionalEnv("WIDGET_TITLE") ?? "Wavy Top 10";
}

export function getWidgetBaseUrl(): string {
  const value = readRequiredEnv("WIDGET_BASE_URL");
  return value.replace(/\/+$/, "");
}

export function getWidgetTimeRange(): TimeRange {
  const value = readOptionalEnv("WIDGET_TIME_RANGE") ?? "short_term";

  if (value === "short_term" || value === "medium_term" || value === "long_term") {
    return value;
  }

  throw new EnvError("WIDGET_TIME_RANGE must be short_term, medium_term, or long_term.");
}
