const AccountAdmin = require("../../models/account-admin.model");

module.exports.login = async (req, res) => {
  res.render("admin/pages/login", {
    pageTitle: "Đăng nhập",
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

  const newAccount = new AccountAdmin({
    fullName: fullName,
    email: email,
    password: password,
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
