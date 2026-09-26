const Task = require("../models/Task");

// READ
const getTasks = async (req, res) => {
  const tasks = await Task.find();

  res.json(tasks);
};

// CREATE
const createTask = async (req, res) => {
  const task = await Task.create(req.body);

  res.status(201).json(task);
};

// UPDATE
const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: "after" }
  );

  res.json(task);
};

// DELETE
const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  res.json(task);
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};