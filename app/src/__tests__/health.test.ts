import { AddressInfo } from "node:net";
import { describe, expect, test } from "@jest/globals";
import app from "../server";

describe("GET /health", () => {
  test("returns HTTP 200 when the application is ready", async () => {
    const server = app.listen(0);
    const address = server.address() as AddressInfo;

    try {
      const response = await fetch(`http://127.0.0.1:${address.port}/health`);

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ status: "ok" });
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });
});