import { app } from "../src/index";
import * as request from "supertest";

afterAll(() => {
  app.close();
});
describe("API 테스트", () => {
  test("정상적인 호출 결과", async () => {
    const result = await request(app).get("/fastest-routes");

    expect(result.statusCode).toBe(200);
    expect(result.body.length).toBeGreaterThan(0);
    expect(typeof result.body[0].relativeTime).toBe("string");
    expect(result.body[0].ETA).toBeLessThanOrEqual(result.body[1].ETA);
  });

  test("잘못된 URI", async () => {
    const result = await request(app).get("/fastets-routes");

    expect(result.statusCode).toBe(404);
  });
});
