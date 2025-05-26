module.exports.list = async (req, res) => {
  res.render("admin/pages/tour-list", {
    pageTitle: "Danh sách tours",
  });
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/tour-create", {
    pageTitle: "Tạo mới tours",
  });
};
