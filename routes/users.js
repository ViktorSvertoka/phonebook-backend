const express = require("express");

const { signup, login } = require("../controllers/usersControllers");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout");

router.get("/current");

module.exports = router;
