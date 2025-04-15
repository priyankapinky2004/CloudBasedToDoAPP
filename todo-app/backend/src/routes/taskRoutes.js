/**
 * Task Routes
 * Defines all API routes for task operations
 */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET /api/tasks - Get all tasks
router.get('/', taskController.getAllTasks);

// GET /api/tasks/:id - Get a specific task by ID
router.get('/:id', taskController.getTaskById);

// POST /api/tasks - Create a new task
router.post('/', taskController.createTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', taskController.deleteTask);

// PATCH /api/tasks/:id/status - Toggle task completion status
router.patch('/:id/status', taskController.toggleTaskStatus);

module.exports = router;