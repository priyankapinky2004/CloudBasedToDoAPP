/**
 * API Service for Todo App
 * Handles all communication with the backend
 */

// API base URL - change this when deploying
const API_BASE_URL = 'http://localhost:5000/api';

// In production, use the deployed backend URL
// const API_BASE_URL = 'https://your-backend-app.onrender.com/api';

/**
 * Handles API errors and throws with a readable message
 * @param {Response} response - Fetch response object
 * @returns {Promise} - Resolves with the response if OK, rejects with error
 */
async function handleResponse(response) {
  if (!response.ok) {
    // Try to get the error message from the response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    } catch (error) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  }
  
  // Return JSON if content exists, otherwise return empty object
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return {};
  }
}

/**
 * API wrapper for the Todo app
 */
const api = {
  /**
   * Get all tasks from the API
   * @returns {Promise<Array>} Array of task objects
   */
  getTasks: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },
  
  /**
   * Get a single task by ID
   * @param {string} taskId - The task ID to fetch
   * @returns {Promise<Object>} Task object
   */
  getTask: async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`Failed to fetch task ${taskId}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new task
   * @param {Object} taskData - The task data to create
   * @returns {Promise<Object>} Created task object
   */
  createTask: async (taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing task
   * @param {string} taskId - The task ID to update
   * @param {Object} taskData - The updated task data
   * @returns {Promise<Object>} Updated task object
   */
  updateTask: async (taskId, taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`Failed to update task ${taskId}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a task
   * @param {string} taskId - The task ID to delete
   * @returns {Promise<Object>} Response object
   */
  deleteTask: async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`Failed to delete task ${taskId}:`, error);
      throw error;
    }
  },
  
  /**
   * Toggle the completion status of a task
   * @param {string} taskId - The task ID to update
   * @param {boolean} completed - The new completion status
   * @returns {Promise<Object>} Updated task object
   */
  toggleTaskStatus: async (taskId, completed) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed })
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`Failed to toggle status for task ${taskId}:`, error);
      throw error;
    }
  }
};