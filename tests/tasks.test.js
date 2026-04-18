import request from "supertest";
import app from "../src/app.js";

let token;

beforeEach(async () => {
  const email = `task-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;
  const password = "123456";

  // Register
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Task User",
      email,
      password
    });

  // Login
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password
    });

  token = res.body.token;
});

describe("Task Routes", () => {

  it("should not allow access without token", async () => {
    const res = await request(app)
      .get("/api/tasks");

    expect(res.statusCode).toBe(401);
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");
  });

  it("should get user tasks only", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
