const app = require("./app");

const mongoConnect = require("./db/dbConnect");

const { PORT } = process.env;

const startServer = async () => {
  try {
    await mongoConnect(
      app.listen(PORT, () => {
        console.log(`Server running. Use our API on port: ${PORT}`);
      })
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
