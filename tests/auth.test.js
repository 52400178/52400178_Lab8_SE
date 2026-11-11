const request = require("supertest");
const app = require("../app");

describe("API Đăng ký / Đăng nhập - Đồ án Đặt món Đa nhà hàng", () => {
  const username = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const password = "Password@123";

  test("Đăng ký tài khoản Khách hàng thành công", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username, password, role: "CUSTOMER" });
    expect(response.status).toBe(201);
    expect(response.body.user.username).toBe(username);
    expect(response.body.user.role).toBe("CUSTOMER");
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  test("Từ chối đăng ký trùng tên đăng nhập", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username, password });
    expect(response.status).toBe(409);
  });

  test("Đăng nhập tài khoản thành công", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username, password });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Đăng nhập thành công");
  });

  test("Từ chối khi nhập sai mật khẩu", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username, password: "WrongPassword123" });
    expect(response.status).toBe(401);
  });

  test("Từ chối mật khẩu quá ngắn (< 8 ký tự)", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: `short_${Date.now()}`, password: "123" });
    expect(response.status).toBe(400);
  });

  test("Từ chối tên đăng nhập chỉ chứa khoảng trắng", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "   ", password });
    expect(response.status).toBe(400);
  });

  test("Từ chối khi thiếu thông tin mật khẩu", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: `missing_${Date.now()}` });
    expect(response.status).toBe(400);
  });
});