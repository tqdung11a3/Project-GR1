const router = require("express").Router();

const settingController = require("../../controllers/admin/setting.controller");

router.get("/list", settingController.list);
router.get("/account-admin/list", settingController.accountAdminList);

module.exports = router;
