const mongoose = require('mongoose')
const Task = require('../models/task');
const taskAppError = require('../utils/errorClass')


/**
 * @openapi
 * /task:
 *  get:
 *    tags:
 *    - Tasks
 *    description: Get Authenticated User's All Tasks
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      '400':
 *          description: Bad request, an error accured
 *      '511': 
 *          description: Authentification Required, No valid jwt tocken in header
 *      '200':
 *          description: OK,
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  owner: 
 *                    type: object
 *                    description: Task's Owner
 *                    properties:
 *                      id:
 *                        type: string
 *                      username:
 *                        type: string
 *                  name:
 *                    type: string
 *                    description: Task's name/title
 *                  status:
 *                    type: string
 *                    description: Task's Status
 *                    ednum:
 *                      - "PENDING"
 *                      - "PROCESSING"
 *                      - "DONE"
 *                  dueDate: 
 *                    type: string
 *                    description: task's due Date of type JS Date string (YYYY-MM-DDTHH:mm:ss.sssZ) format          
 */
const GetTasks = async (req, res, next) => {
  const user = req.user

  if (!user)
    throw new taskAppError(511, "No User Found Please Authentificate")

  const tasks = await Task.find({ owner: user.id })

  res.status(200).json(tasks)
}

/**
 * @openapi
 * /task/{TaskID}:
 *  get:
 *    tags:
 *    - Tasks
 *    description: Get Authenticated User Task By ID
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      '400':
 *          description: Bad request, an error accured
 *      '511': 
 *          description: Authentification Required, No valid jwt tocken in header
 *      '424':
 *          description: Failed Dependency, Task's ID is unvalid, provide a valid Task's ID
 *      '200':
 *          description: OK,
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  owner: 
 *                    type: object
 *                    description: Task's Owner
 *                    properties:
 *                      id:
 *                        type: string
 *                      username:
 *                        type: string
 *                  name:
 *                    type: string
 *                    description: Task's name/title
 *                  status:
 *                    type: string
 *                    description: Task's Status
 *                    ednum:
 *                      - "PENDING"
 *                      - "PROCESSING"
 *                      - "DONE"
 *                  dueDate: 
 *                    type: string
 *                    description: task's due Date of type JS Date string (YYYY-MM-DDTHH:mm:ss.sssZ) format          
 */
const GetTasksById = async (req, res, next) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new taskAppError(424, "Task's ID is unvalid")

  const user = req.user
  if (!user)
    throw new taskAppError(511, "No User Found Please Authentificate")


  const tasks = await Task.findOne({ _id: id, owner: user.id })

  res.status(200).json(tasks)
}

/**
 * @openapi
 * /task/:
 *  post:
 *    tags:
 *    - Tasks
 *    description: Create a Task
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Task Title
 *              dueDate:
 *                type: string
 *                description: a JS Date string (YYYY-MM-DDTHH:mm:ss.sssZ) format
 *    responses:
 *      '511': 
 *          description: Authentification Required, No valid jwt tocken in header
 *      '400':
 *          description: Bad request, an error accured
 *      '201':
 *          description: Task Created Successfully
 *          
 */
const CreateTask = async (req, res, next) => {
  const { name, dueDate } = req.body;

  const user = req.user

  if (!user)
    throw new taskAppError(511, "No User Found Please Authentificate")

  const task = new Task({
    owner: user._id,
    name,
    dueDate,
  })
  const result = await task.save()

  if (!result)
    throw new taskAppError(400, "Couldn't Create Your Task")

  res.status(201).json(task)
}

/**
 * @openapi
 * /task/{TaskID}:
 *  delete:
 *    tags:
 *    - Tasks
 *    description: Create a Task
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      '511': 
 *          description: Authentification Required, No valid jwt tocken in header
 *      '424':
 *          description: Failed Dependency, Task's ID is unvalid, provide a valid Task's ID
 *      '417':
 *          description: Expectation Failed, Couldn't Delete Your Task
 *      '400':
 *          description: Bad request, an error accured
 *      '200':
 *          description: Ok, Task Deleted Successfully
 *          
 */
const DeleteTask = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new taskAppError(424, "Task's ID is unvalid")

  const user = req.user;

  if (!user)
    throw new taskAppError(511, "No User Found Please Authentificate")

  const result = await Task.findOneAndDelete({ _id: id, owner: user.id })
  if (!result)
    throw new taskAppError(417, "Couldn't Delete Your Task")

  res.sendStatus(200)
}

/**
 * @openapi
 * /task/{TaskID}:
 *  put:
 *    tags:
 *    - Tasks
 *    description: Update Tasks
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: flase
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Task Title
 *                required: false
 *              dueDate:
 *                type: string
 *                description: a JS Date string (YYYY-MM-DDTHH:mm:ss.sssZ) format
 *                required: false
 *              status:
 *                type: string
 *                description: Task's Status
 *                required: false
 *                ednum:
 *                - "PENDING"
 *                - "PROCESSING"
 *                - "DONE"
 *    responses:
 *      '511': 
 *          description: Authentification Required, No valid jwt tocken in header
 *      '424':
 *          description: Failed Dependency, Task's ID is unvalid, provide a valid Task's ID
 *      '417':
 *          description: Expectation Failed, Couldn't Update Your Task
 *      '400':
 *          description: Bad request, an error accured
 *      '200':
 *          description: Task Updated Successfully
 *          
 */
const UpdateTask = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new taskAppError(424, "Task's ID is unvalid")


  const user = req.user;

  if (!user)
    throw new taskAppError(511, "No User Found Please Authentificate")

  const { name, dueDate, status } = req.body;

  const result = await Task.findOneAndUpdate({ _id: id, owner: user.id }, { name, dueDate, status }, { runValidators: true })

  if (!result)
    throw new taskAppError(417, "Couldn't Update Your Task")

  res.sendStatus(200)
}


module.exports = { GetTasks, GetTasksById, CreateTask, DeleteTask, UpdateTask }