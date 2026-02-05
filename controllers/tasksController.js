const tasks = require("../models/tasks.json");
const { sendResponse, sendErrorResponse } = require('../utils/util');

// Get all tasks
const getTasks = (req, res) => {
    return sendResponse(res, 200, tasks)
}

// Get task by specific id
const getTaskById = (req, res) => {
    if (!req.params.id)
        return sendErrorResponse(res, 400, "Please provide a valid task id.");

    const task = tasks.find(_task => _task.id == req.params.id);

    if (!task)
        return sendErrorResponse(res, 404, "Task not found");

    return sendResponse(res, 200, task);
}

// Add new task by specific id
const addTask = (req, res) => {
    const { title, description, completed } = req.body || {};

    if (!title || !description || typeof completed !== 'boolean')
        return sendErrorResponse(res, 400, "Please provide valid task details.");

    const lastTask = tasks.length ? tasks[tasks.length - 1] : { id: 0 };
    const newId = lastTask.id + 1;

    tasks.push({
        id: newId,
        title,
        description,
        completed
    });

    // console.log("New task created", tasks);

    return sendResponse(res, 201, "Task created successfully!");
}

// Update existing task by specific id
const updateTask = (req, res) => {
    const { title, description, completed } = req.body || {};
    const id = req.params.id;

    if (!id || !(title || description))
        return sendErrorResponse(res, 400, "Please provide valid task details.");
    
    if (req.body.hasOwnProperty('title') && !title)
        return sendErrorResponse(res, 400, "Please provide valid task details.");
    
    if (req.body.hasOwnProperty('description') && !description)
        return sendErrorResponse(res, 400, "Please provide valid task details.");
    
    if (req.body.hasOwnProperty('completed') && typeof completed !== 'boolean')
        return sendErrorResponse(res, 400, "Please provide valid task details.");

    const taskIndex = tasks.findIndex(_task => _task.id == id);

    if (taskIndex == -1)
        return sendErrorResponse(res, 404, "Task not found");

    tasks[taskIndex] = Object.assign(tasks[taskIndex], { title, description, completed })

    // console.log("Task updated", tasks[taskIndex]);

    return sendResponse(res, 200, "Task saved successfully!");
}

const deleteTask = (req, res) => {
    const id = req.params.id;
    // console.log('id', id)

    if (!id)
        return sendErrorResponse(res, 400, "Please provide task id.");

    const taskIndex = tasks.findIndex(_task => _task.id == id);

    if (taskIndex == -1)
        return sendErrorResponse(res, 404, "Task not found");

    tasks.splice(taskIndex, 1)

    // console.log("Task deleted");

    return sendResponse(res, 200, "Task deleted successfully!");
}

module.exports = {
    getTasks,
    getTaskById,
    addTask,
    updateTask,
    deleteTask
}