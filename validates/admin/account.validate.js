const Joi = require("joi");

module.exports.registerPost = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().required().min(5).max(50).messages({
      "string.empty": "Vui long nhap ho ten!",
      "string.min": "Ho ten phai co it nhat 5 ky tu",
      "string.max": "Ho ten khong duoc qua 50 ky tu",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "Vui long nhap email!",
      "string.email": "Email khong dung dinh dang",
    }),
    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value)) {
          return helpers.error("password.uppercase");
        }

        if (!/[a-z]/.test(value)) {
          // Ít nhất một chữ cái thường
          return helpers.error("password.lowercase");
        }

        if (!/\d/.test(value)) {
          // Ít nhất một chữ số
          return helpers.error("password.number");
        }

        if (!/[!@#$%^&*]/.test(value)) {
          // Ít nhất một ký tự đặc biệt
          return helpers.error("password.special");
        }

        return value; // Nếu tất cả điều kiện đều đúng
      })
      .messages({
        "string.empty": "Vui lòng nhập mật khẩu!",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
        "password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
        "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
        "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
      }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;

    res.json({
      code: "error",
      message: errorMessage,
    });
    return;
  }

  next();
};

module.exports.loginPost = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().email().messages({
      "string.empty": "Vui long nhap email!",
      "string.email": "Email khong dung dinh dang",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập mật khẩu!",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;

    res.json({
      code: "error",
      message: errorMessage,
    });
    return;
  }

  next();
};
