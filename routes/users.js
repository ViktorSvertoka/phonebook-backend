const express = require("express");

const {
  signup,
  login,
  logout,
  current,
  updateAvatar,
} = require("../controllers/usersControllers");
const { authenticate } = require("../middlewares/authenticate");
const { upload } = require("../middlewares/upload");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, current);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
