const express = require("express");
const taskRouter = require("./routes/task-routes");
require("./config/db");
const cors = require("cors");

const app = express();
//it alow backend to communicate with frontend
app.use(cors());

app.set("view engine", "ejs");
//it allows to take raw body in json
app.use(express.json());

app.use("/api/v1/task", taskRouter);

app.use("/api/v1", (req, res, next) => {
  res.send("Route doesnot exist");
});

app.listen(5000, () => console.log("app started at 5000..."));