import request from "supertest";
import app from "../src/app.js";

describe("Auth Routes", () => {
  const createEmail = () => `test-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;

  it("should register a user", async () => {
    const email = createEmail();
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email,
        password: "123456"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe(email);
  });

  it("should login user and return token", async () => {
    const email = createEmail();
    const password = "123456";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Login User",
        email,
        password
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
