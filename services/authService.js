const bcrypt = require("bcryptjs");
// Mảng lưu trữ tạm thời tài khoản theo kiến trúc đồ án
const users = [];
let nextId = 1;

// Khai báo các vai trò hợp lệ trong Đồ án Đặt món Đa nhà hàng
const VALID_ROLES = ["CUSTOMER", "RESTAURANT", "DRIVER", "ADMIN"];

async function register(username, password, role = "CUSTOMER") {
  if (typeof username !== "string" || typeof password !== "string") {
    throw new Error("Tên đăng nhập và mật khẩu phải là chuỗi");
  }

  const normalizedUsername = username.trim().toLowerCase();
  const upperRole = role.toUpperCase();

  if (!normalizedUsername || !password) {
    throw new Error("Tên đăng nhập và mật khẩu là bắt buộc");
  }

  if (password.length < 8) {
    throw new Error("Mật khẩu phải có ít nhất 8 ký tự");
  }

  if (!VALID_ROLES.includes(upperRole)) {
    throw new Error("Vai trò người dùng không hợp lệ");
  }

  const existed = users.some(user => user.username === normalizedUsername);
  if (existed) {
    throw new Error("Tên đăng nhập đã tồn tại");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: nextId++,
    username: normalizedUsername,
    role: upperRole,
    passwordHash
  };

  users.push(user);

  // Không trả về passwordHash để bảo mật
  return {
    id: user.id,
    username: user.username,
    role: user.role
  };
}

async function login(username, password) {
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password
  ) {
    throw new Error("Tên đăng nhập và mật khẩu là bắt buộc");
  }

  const normalizedUsername = username.trim().toLowerCase();
  const user = users.find(item => item.username === normalizedUsername);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role
  };
}

module.exports = { register, login };