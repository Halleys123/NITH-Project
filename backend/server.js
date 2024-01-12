require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const app = require("./app");
mongoose
  .connect(
    process.env.MONGO_URI.replace("<password>", process.env.DATABASE_PASSWORD)
  )
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.error("Unable to connect to the database");
  });
app.listen(process.env.PORT, () => {
  console.log("server started");
});
