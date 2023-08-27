const mongoose = require("mongoose");

const { DB_URL } = process.env;

const mongoConnect = async () => {
  await mongoose.connect(DB_URL);
};

module.exports = mongoConnect;
