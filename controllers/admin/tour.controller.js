module.exports.list = async (req, res) => {
  res.render("admin/pages/tour-list", {
    pageTitle: "Danh sách tours",
  });
};
