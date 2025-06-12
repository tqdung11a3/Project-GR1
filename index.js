const express = require("express");
const path = require("path");
require("dotenv").config();
const database = require("./config/database");
const adminRoutes = require("./routes/admin/index.route");
const clientRoutes = require("./routes/client/index.route");
const variableConfig = require("./config/variable");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

// Kết nối database
database.connect();

// Thiết lập thư mục views và view engine pug
app.set("views", path.join(__dirname, "views")); // Thư mục chứa file pug

app.set("view engine", "pug"); // Thiết lập pug làm view engine

// Thiết lập thư mục chứa các file tĩnh
app.use(express.static(path.join(__dirname, "public")));

// Tạo biến toàn cục trong file PUG
app.locals.pathAdmin = variableConfig.pathAdmin;

// Tạo biến toàn cục trong các file js backend
global.pathAdmin = variableConfig.pathAdmin;

// Cho phep gui data len dang json
app.use(express.json());

// Sử dụng cookieParser
app.use(cookieParser());

// Thiết lập đường dẫn
app.use(`/${variableConfig.pathAdmin}`, adminRoutes);
app.use("/", clientRoutes);

app.listen(port, () => {
  console.log(`Website đang chạy trên cổng ${port}`);
});
