const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

const handleError = (err) => {
  console.log(err.message);
  let error = {};
  if (err.message.includes("Task validation failed")) {
    console.log(Object.values(err.errors));
    Object.values(err.errors).forEach((properties) => {
      error[properties.path] = properties.message;
    });
  }
  return error;
};

router.get("/dashboard", auth, (req, res) => {
  res.render("dashboard", {
    username: req.user.name,
    usermail: req.user.email,
  });
});
router.get("/edit-task", auth, (req, res) => {
  res.render("edit-task", {
    username: req.user.name,
  });
});

// Create Task
router.post("/tasks", auth, async (req, res) => {
  console.log(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    console.log("task", task);
    await task.save();
    res.status(201).json({ task });
  } catch (e) {
    // console.log(error);
    const err = handleError(e);
    res.status(400).json({ err });
  }
});
// GET all tasks created by user
router.get("/tasks", auth, async (req, res) => {
  try {
    await req.user.populate({ path: "mytasks" });
    res.status(200).json({ tasks: req.user.mytasks });
  } catch (e) {
    res.status(500).json(error.message);
  }
});

// GET task by id
router.get('/tasks/:id', auth, async(req,res)=>{
  const _id = req.params.id;
  try {
    const task = await Task.findOne({_id, owner:req.user._id});
    if(!task){
      return res.status(404).send();
    }
    res.status(200).json({task});
  } catch (error) {
    res.status(500).json({error});
  }
})
// Update the user task

router.patch('/tasks/:id', auth, async(req, res)=>{
  console.log(req.body);
  const updates = Object.keys(req.body);
  console.log(updates);
  const allowedUpdates = ['description', 'completed'];

  const isValidOperation = updates.every((update)=>{
    return allowedUpdates.includes(update);
  })
  if(!isValidOperation){
    return res.status(400).json({error:'Invalid Updates'});
  }
  try {
    const task = await Task.findOne({_id:req.params.id, owner:req.user._id})
    if(!task){
      res.status(404).json({error:'Task Not Found'});
    }
    updates.forEach((update)=>{
      task[update] = req.body[update];
    })
    await task.save();
    res.status(200).json({task})
  } catch (error) {
    res.status(400).json(error.message);
  }
})

// Delete Task by Id
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).json();
    }
    res.send(task);
  } catch (error) {
    res.status(500).json();
  }
});
module.exports = router;
