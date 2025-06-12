const AccountAdmin = require("../../models/account-admin.model");
const bcrypt = require("bcryptjs");

module.exports.login = async (req, res) => {
  res.render("admin/pages/login", {
    pageTitle: "Đăng nhập",
  });
};

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

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
