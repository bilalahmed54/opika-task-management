const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://127.0.0.1:27017/opika-task-management-db")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log("Unable to Connect Database", err);
  });
