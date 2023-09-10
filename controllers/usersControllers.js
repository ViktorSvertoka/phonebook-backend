const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const gravatar = require("gravatar");

const { User } = require("../db/models/userModal.js");

const { SECRET_KEY } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.status(409).json({ message: "Email in use" });

    return;
  }

  const avatar = gravatar.url(email);

  const newUser = new User({
    name,
    email,
    password,
    avatar,
  });

  await newUser.hashPassword(password);

  await newUser.save();

  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY);

  await User.findByIdAndUpdate(newUser._id, { token });

  res.status(201).json({
    token: token,
    user: {
      name,
      email,
      avatar,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({ message: "Email or password is wrong " });

    return;
  }

  const result = user.comparePassword(password);

  if (!result) {
    res.status(401).json({ message: "Email or password is wrong " });

    return;
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY);

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token: token,
    user: {
      name: user.name,
      email,
      avatar: user.avatar,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).send();
};

const current = (req, res) => {
  const { email, name, avatar } = req.user;
  res.status(200).json({
    email,
    name,
    avatar,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, fileName);
  await fs.rename(tempUpload, resultUpload);
  const avatar = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatar });
  res.json({
    avatar,
  });
};

module.exports = { signup, login, logout, current, updateAvatar };
