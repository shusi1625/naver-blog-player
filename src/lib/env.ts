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
  return readOptionalEnv("WIDGET_TITLE") ?? "Top 10";
}

export function getWidgetBackgroundColor(): string {
  const value = readOptionalEnv("WIDGET_BACKGROUND_COLOR") ?? "#121212";

  if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
    throw new EnvError("WIDGET_BACKGROUND_COLOR must be a 6-digit hex color like #121212.");
  }

  return value;
}

export function getWidgetBaseUrl(): string {
  const value = readRequiredEnv("WIDGET_BASE_URL");
  return value.replace(/\/+$/, "");
}

export function getWidgetProfileImageUrl(): string | undefined {
  return readOptionalEnv("WIDGET_PROFILE_IMAGE_URL");
}

export function getWidgetProfileUrl(): string | undefined {
  return readOptionalEnv("WIDGET_PROFILE_URL");
}

export function getWidgetDataCacheSeconds(): number {
  const value = readOptionalEnv("WIDGET_DATA_CACHE_SECONDS");

  if (!value) {
    return 60;
  }

  const seconds = Number(value);

  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new EnvError("WIDGET_DATA_CACHE_SECONDS must be a non-negative number.");
  }

  return seconds;
}

export function getWidgetSvgCacheSeconds(): number {
  const value = readOptionalEnv("WIDGET_SVG_CACHE_SECONDS");

  if (!value) {
    return 60;
  }

  const seconds = Number(value);

  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new EnvError("WIDGET_SVG_CACHE_SECONDS must be a non-negative number.");
  }

  return seconds;
}

export function getWidgetTimeRange(): TimeRange {
  const value = readOptionalEnv("WIDGET_TIME_RANGE") ?? "short_term";

  if (value === "short_term" || value === "medium_term" || value === "long_term") {
    return value;
  }

  throw new EnvError("WIDGET_TIME_RANGE must be short_term, medium_term, or long_term.");
}
