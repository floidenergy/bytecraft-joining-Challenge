const { Router } = require('express');

const tryCatch = require('../utils/tryCatch')
const { GetTasks, GetTasksById, CreateTask, DeleteTask, UpdateTask } = require('../controllers/Tasks')

const TasksRouter = Router();

TasksRouter.route('/')
  .get(tryCatch(GetTasks))
  .post(tryCatch(CreateTask))

TasksRouter.route("/:id")
  .get(tryCatch(GetTasksById))
  .put(tryCatch(UpdateTask))
  .delete(tryCatch(DeleteTask))


module.exports = TasksRouter