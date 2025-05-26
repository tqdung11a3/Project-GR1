module.exports.list = async (req, res) => {
  res.render("admin/pages/order-list", {
    pageTitle: "Danh sách đơn hàng",
  });
};
