const express = require("express");
const { addTask, getTasks, getTask, updateTask, deleteTask } = require("../controller/task-controller");

const taskRouter = express.Router();
taskRouter.post("/", addTask);
taskRouter.get("/", getTasks);
taskRouter.get("/:id", getTask);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);
module.exports = taskRouter;
