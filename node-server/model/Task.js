const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  }
});

module.exports = mongoose.model("Task", TaskSchema);
