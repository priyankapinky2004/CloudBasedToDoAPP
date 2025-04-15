/**
 * Task Controller
 * Handles all the business logic for task-related operations
 */

const { tasksCollection } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

// Helper function to format a task from Firestore
const formatTask = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description || '',
    dueDate: data.dueDate,
    completed: data.completed || false,
    createdAt: data.createdAt
  };
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    // Get all tasks, ordered by creation date
    const snapshot = await tasksCollection.orderBy('createdAt', 'desc').get();
    
    // Format the tasks data
    const tasks = snapshot.docs.map(formatTask);
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ message: 'Failed to retrieve tasks', error: error.message });
  }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Get the task document
    const taskDoc = await tasksCollection.doc(taskId).get();
    
    // Check if task exists
    if (!taskDoc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Format and return the task
    const task = formatTask(taskDoc);
    res.status(200).json(task);
  } catch (error) {
    console.error(`Error getting task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to retrieve task', error: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    // Validate request body
    const { title, description, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (!dueDate) {
      return res.status(400).json({ message: 'Due date is required' });
    }
    
    // Create task object with default values
    const newTask = {
      id: uuidv4(),
      title,
      description: description || '',
      dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    // Save to Firestore
    await tasksCollection.doc(newTask.id).set(newTask);
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

// Update an existing task
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, dueDate, completed } = req.body;
    
    // Validate request
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    // Check if task exists
    const taskDoc = await tasksCollection.doc(taskId).get();
    if (!taskDoc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Update the task with new values
    const updatedTask = {
      title,
      description: description || '',
      dueDate,
      completed: completed !== undefined ? completed : taskDoc.data().completed,
      updatedAt: new Date().toISOString()
    };
    
    // Save to Firestore
    await tasksCollection.doc(taskId).update(updatedTask);
    
    // Return updated task data
    res.status(200).json({
      id: taskId,
      ...updatedTask
    });
  } catch (error) {
    console.error(`Error updating task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Check if task exists
    const taskDoc = await tasksCollection.doc(taskId).get();
    if (!taskDoc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Delete the task
    await tasksCollection.doc(taskId).delete();
    
    res.status(200).json({ message: 'Task deleted successfully', id: taskId });
  } catch (error) {
    console.error(`Error deleting task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};

// Toggle task completion status
const toggleTaskStatus = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { completed } = req.body;
    
    // Validate request
    if (completed === undefined) {
      return res.status(400).json({ message: 'Completed status is required' });
    }
    
    // Check if task exists
    const taskDoc = await tasksCollection.doc(taskId).get();
    if (!taskDoc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Update only the completion status
    const updates = {
      completed: completed,
      updatedAt: new Date().toISOString()
    };
    
    // Save to Firestore
    await tasksCollection.doc(taskId).update(updates);
    
    // Return the updated task
    const updatedTask = {
      id: taskId,
      ...taskDoc.data(),
      ...updates
    };
    
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(`Error toggling status for task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update task status', error: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
};