/**
 * Express Server for Todo App Backend
 * Sets up the server, middleware, and routes with Firebase Firestore integration
 */

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Firebase setup
const admin = require('firebase-admin');
let serviceAccount;

try {
  // Try to load from environment variable for production
  if (process.env.FIREBASE_CONFIG) {
    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
  } else {
    // For local development, load from file - UPDATED PATH
    serviceAccount = require('./firebase-service-account.json');
  }
} catch (error) {
  console.warn('Warning: Firebase service account not found.', error.message);
  console.log('Using in-memory storage instead. Tasks will not persist when server restarts.');
}

// Initialize Firebase if service account is available
let db;
let tasksCollection;

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  db = admin.firestore();
  tasksCollection = db.collection('tasks');
  console.log('Firebase Firestore initialized successfully');
} else {
  console.log('Running with in-memory storage');
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Todo App API',
    status: 'Running',
    storage: serviceAccount ? 'Firebase Firestore' : 'In-memory'
  });
});

// In-memory fallback storage
const inMemoryTasks = [];

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

// API Routes

// GET /api/tasks - Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    if (tasksCollection) {
      // Firebase storage
      const snapshot = await tasksCollection.orderBy('createdAt', 'desc').get();
      const tasks = snapshot.docs.map(formatTask);
      res.status(200).json(tasks);
    } else {
      // In-memory storage
      res.status(200).json(inMemoryTasks);
    }
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ message: 'Failed to retrieve tasks', error: error.message });
  }
});

// GET /api/tasks/:id - Get a single task
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    
    if (tasksCollection) {
      // Firebase storage
      const taskDoc = await tasksCollection.doc(taskId).get();
      
      if (!taskDoc.exists) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      const task = formatTask(taskDoc);
      res.status(200).json(task);
    } else {
      // In-memory storage
      const task = inMemoryTasks.find(t => t.id === taskId);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      res.status(200).json(task);
    }
  } catch (error) {
    console.error(`Error getting task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to retrieve task', error: error.message });
  }
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (!dueDate) {
      return res.status(400).json({ message: 'Due date is required' });
    }
    
    const newTask = {
      id: uuidv4(),
      title,
      description: description || '',
      dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    if (tasksCollection) {
      // Firebase storage
      await tasksCollection.doc(newTask.id).set(newTask);
    } else {
      // In-memory storage
      inMemoryTasks.push(newTask);
    }
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

// PUT /api/tasks/:id - Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, dueDate, completed } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (tasksCollection) {
      // Firebase storage
      const taskDoc = await tasksCollection.doc(taskId).get();
      
      if (!taskDoc.exists) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      const updatedTask = {
        title,
        description: description || '',
        dueDate,
        completed: completed !== undefined ? completed : taskDoc.data().completed,
        updatedAt: new Date().toISOString()
      };
      
      await tasksCollection.doc(taskId).update(updatedTask);
      
      res.status(200).json({
        id: taskId,
        ...updatedTask
      });
    } else {
      // In-memory storage
      const taskIndex = inMemoryTasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      const updatedTask = {
        ...inMemoryTasks[taskIndex],
        title,
        description: description || '',
        dueDate,
        completed: completed !== undefined ? completed : inMemoryTasks[taskIndex].completed,
        updatedAt: new Date().toISOString()
      };
      
      inMemoryTasks[taskIndex] = updatedTask;
      res.status(200).json(updatedTask);
    }
  } catch (error) {
    console.error(`Error updating task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    
    if (tasksCollection) {
      // Firebase storage
      const taskDoc = await tasksCollection.doc(taskId).get();
      
      if (!taskDoc.exists) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      await tasksCollection.doc(taskId).delete();
    } else {
      // In-memory storage
      const taskIndex = inMemoryTasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      inMemoryTasks.splice(taskIndex, 1);
    }
    
    res.status(200).json({ message: 'Task deleted successfully', id: taskId });
  } catch (error) {
    console.error(`Error deleting task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
});

// PATCH /api/tasks/:id/status - Toggle task completion status
app.patch('/api/tasks/:id/status', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { completed } = req.body;
    
    if (completed === undefined) {
      return res.status(400).json({ message: 'Completed status is required' });
    }
    
    if (tasksCollection) {
      // Firebase storage
      const taskDoc = await tasksCollection.doc(taskId).get();
      
      if (!taskDoc.exists) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      const updates = {
        completed: completed,
        updatedAt: new Date().toISOString()
      };
      
      await tasksCollection.doc(taskId).update(updates);
      
      const updatedTask = {
        id: taskId,
        ...taskDoc.data(),
        ...updates
      };
      
      res.status(200).json(updatedTask);
    } else {
      // In-memory storage
      const taskIndex = inMemoryTasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      inMemoryTasks[taskIndex].completed = completed;
      inMemoryTasks[taskIndex].updatedAt = new Date().toISOString();
      
      res.status(200).json(inMemoryTasks[taskIndex]);
    }
  } catch (error) {
    console.error(`Error toggling status for task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update task status', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Storage: ${serviceAccount ? 'Firebase Firestore' : 'In-memory'}`);
});