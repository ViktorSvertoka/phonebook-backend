const jwt = require("jsonwebtoken");

const { User } = require("../db/models/userModal.js");

const { SECRET_KEY } = process.env;

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.status(409).json({ message: "Email in use" });

    return;
  }

  const newUser = new User({
    name,
    email,
    password,
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
    },
  });
};

module.exports = { signup, login };
