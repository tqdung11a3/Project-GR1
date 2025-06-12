const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AccountAdmin = require("../../models/account-admin.model");
const ForgotPassword = require("../../models/forgot-password.model");

const generateHelper = require("../../helpers/generate.helper");
const mailHelper = require("../../helpers/mail.helper");

module.exports.login = async (req, res) => {
  res.render("admin/pages/login", {
    pageTitle: "Đăng nhập",
  });
};

module.exports.loginPost = async (req, res) => {
  const { email, password, rememberPassword } = req.body;

  // Kiem tra email co ton tai khong

  const existAccount = await AccountAdmin.findOne({
    email: email,
  });

  if (!existAccount) {
    res.json({
      code: "error",
      message: "Email khong ton tai trong he thong",
    });
    return;
  }

  // Kiem tra mat khau xem co dung hay khong

  const isPasswordValid = await bcrypt.compare(password, existAccount.password);
  if (!isPasswordValid) {
    res.json({
      code: "error",
      message: "Mat khau khong dung",
    });
    return;
  }

  // Kiem tra tai khoan da duoc kich hoat hay chua

  if (existAccount.status != "active") {
    res.json({
      code: "error",
      message: "Tai khoan chua duoc kich hoat",
    });
    return;
  }

  // Tao JWT
  const token = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberPassword ? "30d" : "1d", // Token có thời hạn 30 ngày hoặc 1 ngày
    }
  );

  res.cookie("token", token, {
    maxAge: rememberPassword ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // Token lưu trong cookie 30 ngày hoặc 1 ngày
    httpOnly: true, // Cho phep server duoc truy cap cookie nay
    sameSite: "strict", // Khong gui duoc yeu cau tu website khac
  });

  res.json({
    code: "success",
    message: "Dang nhap tai khoan thanh cong",
  });
};

module.exports.register = async (req, res) => {
  res.render("admin/pages/register", {
    pageTitle: "Đăng ký",
  });
};

module.exports.registerPost = async (req, res) => {
  const { fullName, email, password } = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email,
  });

  if (existAccount) {
    res.json({
      code: "error",
      message: "Email da ton tai trong he thong",
    });
    return;
  }

  // Ma hoa mat khau voi bcryptjs
  const salt = await bcrypt.genSalt(10); // Tao chuoi ngau nhien co 10 ky tu
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log("Chay vao controller");

  const newAccount = new AccountAdmin({
    fullName: fullName,
    email: email,
    password: hashedPassword,
    status: "initial",
  });

  await newAccount.save();

  res.json({
    code: "success",
    message: "Dang ky tai khoan thanh cong",
  });
};

module.exports.registerInitial = async (req, res) => {
  res.render("admin/pages/register-initial", {
    pageTitle: "Tai khoan da duoc khoi tao",
  });
};

module.exports.forgotPassword = async (req, res) => {
  res.render("admin/pages/forgot-password", {
    pageTitle: "Quên mật khẩu",
  });
};

module.exports.forgotPasswordPost = async (req, res) => {
  const { email } = req.body;

  // Kiểm tra xem email có tồn tại không
  const existAccount = await AccountAdmin.findOne({
    email: email,
  });

  if (!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!",
    });
    return;
  }

  // Kiểm tra email đã tồn tại trong ForgotPassword chưa
  const existEmailInForgotPassword = await ForgotPassword.findOne({
    email: email,
  });

  if (existEmailInForgotPassword) {
    res.json({
      code: "error",
      message: "Vui lòng gửi lại yêu cầu sau 5 phút!",
    });
    return;
  }

  // Tạo mã OTP
  const otp = generateHelper.generateRandomNumber(6);

  // Lưu vào database email và mã OTP, sau 5 phút tự xóa bản ghi
  const record = new ForgotPassword({
    email: email,
    otp: otp,
    expireAt: Date.now() + 5 * 60 * 1000,
  });
  await record.save();

  // Gửi email tự động cho người dùng
  const subject = `Mã OTP lấy lại mật khẩu`;
  const content = `Mã OTP của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong 5 phút, vui lòng không cung cấp cho bất kỳ ai.`;

  mailHelper.sendMail(email, subject, content);

  res.json({
    code: "success",
    message: "Đã gửi mã OTP qua email!",
  });
};

module.exports.otpPassword = async (req, res) => {
  res.render("admin/pages/otp-password", {
    pageTitle: "Nhập mã OTP",
  });
};

module.exports.resetPassword = async (req, res) => {
  res.render("admin/pages/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
};

module.exports.logoutPost = async (req, res) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đăng xuất thành công!",
  });
};
