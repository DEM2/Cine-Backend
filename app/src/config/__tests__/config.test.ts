import { afterEach, describe, expect, jest, test } from "@jest/globals";

const originalSeatLockTtl = process.env.SEAT_LOCK_TTL_MINUTES;
const originalMaxTickets = process.env.MAX_TICKETS_PER_SHOWTIME;
const originalCorsOrigins = process.env.CORS_ORIGINS;

afterEach(() => {
  jest.resetModules();

  if (originalSeatLockTtl === undefined) {
    delete process.env.SEAT_LOCK_TTL_MINUTES;
  } else {
    process.env.SEAT_LOCK_TTL_MINUTES = originalSeatLockTtl;
  }

  if (originalMaxTickets === undefined) {
    delete process.env.MAX_TICKETS_PER_SHOWTIME;
  } else {
    process.env.MAX_TICKETS_PER_SHOWTIME = originalMaxTickets;
  }

  if (originalCorsOrigins === undefined) {
    delete process.env.CORS_ORIGINS;
  } else {
    process.env.CORS_ORIGINS = originalCorsOrigins;
  }
});

describe("seat lock configuration", () => {
  test("uses safe defaults when values are absent or invalid", async () => {
    delete process.env.SEAT_LOCK_TTL_MINUTES;
    process.env.MAX_TICKETS_PER_SHOWTIME = "0";

    const config = await import("../seat-lock.config");

    expect(config.SEAT_LOCK_TTL_MINUTES).toBe(10);
    expect(config.MAX_TICKETS_PER_SHOWTIME).toBe(5);
  });

  test("parses positive values and floors decimals", async () => {
    process.env.SEAT_LOCK_TTL_MINUTES = "12.8";
    process.env.MAX_TICKETS_PER_SHOWTIME = "3";

    const config = await import("../seat-lock.config");

    expect(config.SEAT_LOCK_TTL_MINUTES).toBe(12);
    expect(config.MAX_TICKETS_PER_SHOWTIME).toBe(3);
  });
});

describe("CORS configuration", () => {
  test("allows requests without an origin and configured origins", async () => {
    process.env.CORS_ORIGINS = "https://cinema.example,https://admin.example";
    const { corsOptions } = await import("../cors");
    const callback = jest.fn();

    if (typeof corsOptions.origin !== "function") {
      throw new Error("CORS origin callback is not configured");
    }

    corsOptions.origin(undefined, callback);
    corsOptions.origin("https://cinema.example", callback);

    expect(callback).toHaveBeenNthCalledWith(1, null, true);
    expect(callback).toHaveBeenNthCalledWith(2, null, true);
  });

  test("rejects origins outside the configured allowlist", async () => {
    process.env.CORS_ORIGINS = "https://cinema.example";
    const { corsOptions } = await import("../cors");
    const callback = jest.fn();

    if (typeof corsOptions.origin !== "function") {
      throw new Error("CORS origin callback is not configured");
    }

    corsOptions.origin("https://untrusted.example", callback);

    expect(callback).toHaveBeenCalledWith(expect.any(Error));
    expect(callback.mock.calls[0][0]).toHaveProperty(
      "message",
      "Origen no permitido",
    );
  });
});