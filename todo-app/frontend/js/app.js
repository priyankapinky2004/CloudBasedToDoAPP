/**
 * Main application script for Todo App
 * Handles UI interactions, data management, and DOM manipulation
 */

// DOM Elements
const taskForm = document.getElementById('task-form');
const tasksList = document.getElementById('tasks-list');
const filterSelect = document.getElementById('filter-tasks');
const searchInput = document.getElementById('search-tasks');
const themeToggle = document.getElementById('theme-toggle');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const closeModalBtn = document.querySelector('.close');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

// State variables
let tasks = [];
let currentTaskId = null;
let isEditing = false;

// Check for saved theme preference
document.addEventListener('DOMContentLoaded', () => {
  // Initialize date input with today's date
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('task-due-date').value = today;
  
  // Apply theme
  const darkTheme = localStorage.getItem('darkTheme') === 'true';
  if (darkTheme) {
    document.body.classList.add('dark-theme');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  
  // Load tasks
  loadTasks();
});

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDarkMode = document.body.classList.contains('dark-theme');
  localStorage.setItem('darkTheme', isDarkMode);
  
  // Update toggle icon
  themeToggle.innerHTML = isDarkMode
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
});

/**
 * Format date to human-readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Check if a date is in the past
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is in the past
 */
function isDatePast(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(dateString);
  taskDate.setHours(0, 0, 0, 0);
  return taskDate < today;
}

/**
 * Create a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error)
 */
function showToast(message, type = 'success') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  // Add to DOM
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

/**
 * Load tasks from the API
 */
async function loadTasks() {
  try {
    // Show loading state
    tasksList.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i> Loading tasks...
      </div>
    `;
    
    // Fetch tasks from API
    tasks = await api.getTasks();
    
    // Apply current filter
    filterTasks();
  } catch (error) {
    console.error('Error loading tasks:', error);
    tasksList.innerHTML = `
      <div class="error">
        <p>Failed to load tasks. ${error.message}</p>
        <button class="btn btn-primary" onclick="loadTasks()">Try Again</button>
      </div>
    `;
  }
}

/**
 * Filter and render tasks based on filter and search criteria
 */
function filterTasks() {
  const filterValue = filterSelect.value;
  const searchValue = searchInput.value.toLowerCase();
  
  // Apply filters
  let filteredTasks = tasks;
  
  // Filter by status
  if (filterValue === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (filterValue === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  }
  
  // Apply search
  if (searchValue) {
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchValue) || 
      task.description.toLowerCase().includes(searchValue)
    );
  }
  
  // Render tasks
  renderTasks(filteredTasks);
}

/**
 * Render tasks to the DOM
 * @param {Array} tasksToRender - Array of task objects to render
 */
function renderTasks(tasksToRender) {
  // Handle empty state
  if (tasksToRender.length === 0) {
    tasksList.innerHTML = `
      <div class="empty-list">
        <i class="fas fa-clipboard-list fa-3x"></i>
        <p>No tasks found. Add a new task to get started!</p>
      </div>
    `;
    return;
  }
  
  // Clear the list
  tasksList.innerHTML = '';
  
  // Sort tasks: pending first, then by due date
  tasksToRender.sort((a, b) => {
    // Sort by completed status first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then sort by due date
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
  
  // Add tasks to the list
  tasksToRender.forEach(task => {
    // Determine task status
    let statusClass = 'pending';
    let statusText = 'Pending';
    
    if (task.completed) {
      statusClass = 'completed';
      statusText = 'Completed';
    } else if (isDatePast(task.dueDate)) {
      statusClass = 'overdue';
      statusText = 'Overdue';
    }
    
    // Create task element
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskElement.innerHTML = `
      <div class="task-header">
        <h3 class="task-title">${task.title}</h3>
        <span class="task-date">${formatDate(task.dueDate)}</span>
      </div>
      <span class="status-badge ${statusClass}">${statusText}</span>
      <p class="task-description">${task.description || 'No description provided'}</p>
      <div class="task-actions">
        <button class="btn btn-sm ${task.completed ? 'btn-secondary' : 'btn-success'}" data-action="toggle">
          <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
          ${task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button class="btn btn-sm btn-primary" data-action="edit">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-sm btn-danger" data-action="delete">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    `;
    
    // Add event listeners for task actions
    const toggleBtn = taskElement.querySelector('[data-action="toggle"]');
    const editBtn = taskElement.querySelector('[data-action="edit"]');
    const deleteBtn = taskElement.querySelector('[data-action="delete"]');
    
    toggleBtn.addEventListener('click', () => toggleTaskStatus(task.id, !task.completed));
    editBtn.addEventListener('click', () => openEditModal(task));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    // Append to the list
    tasksList.appendChild(taskElement);
  });
}

/**
 * Handle task creation and updates
 * @param {Event} event - Form submission event
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  try {
    // Get form data
    const formData = new FormData(event.target);
    const taskData = {
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: new Date(formData.get('dueDate')).toISOString(),
      completed: false
    };
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    if (isEditing) {
      // Update existing task
      await api.updateTask(currentTaskId, taskData);
      showToast('Task updated successfully');
      
      // Reset editing state
      isEditing = false;
      currentTaskId = null;
      submitBtn.textContent = 'Add Task';
      cancelBtn.style.display = 'none';
    } else {
      // Create new task
      await api.createTask(taskData);
      showToast('Task added successfully');
    }
    
    // Reset form and reload tasks
    event.target.reset();
    document.getElementById('task-due-date').value = new Date().toISOString().split('T')[0];
    loadTasks();
  } catch (error) {
    console.error('Error saving task:', error);
    showToast(`Failed to save task: ${error.message}`, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = isEditing ? 'Update Task' : 'Add Task';
  }
}

/**
 * Toggle task completion status
 * @param {string} taskId - The task ID to toggle
 * @param {boolean} completed - The new completion status
 */
async function toggleTaskStatus(taskId, completed) {
  try {
    await api.toggleTaskStatus(taskId, completed);
    showToast(`Task marked as ${completed ? 'completed' : 'incomplete'}`);
    loadTasks();
  } catch (error) {
    console.error('Error toggling task status:', error);
    showToast(`Failed to update task: ${error.message}`, 'error');
  }
}

/**
 * Delete a task
 * @param {string} taskId - The task ID to delete
 */
async function deleteTask(taskId) {
  // Ask for confirmation
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }
  
  try {
    await api.deleteTask(taskId);
    showToast('Task deleted successfully');
    loadTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
    showToast(`Failed to delete task: ${error.message}`, 'error');
  }
}

/**
 * Open the edit modal for a task
 * @param {Object} task - The task to edit
 */
function openEditModal(task) {
  // Populate the edit form
  document.getElementById('edit-task-id').value = task.id;
  document.getElementById('edit-task-title').value = task.title;
  document.getElementById('edit-task-description').value = task.description || '';
  document.getElementById('edit-task-due-date').value = new Date(task.dueDate).toISOString().split('T')[0];
  document.getElementById('edit-task-completed').checked = task.completed;
  
  // Show the modal
  editModal.style.display = 'flex';
}

/**
 * Handle task editing in the modal
 * @param {Event} event - Form submission event
 */
async function handleEditFormSubmit(event) {
  event.preventDefault();
  
  try {
    // Get form data
    const formData = new FormData(event.target);
    const taskId = document.getElementById('edit-task-id').value;
    const taskData = {
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: new Date(formData.get('dueDate')).toISOString(),
      completed: formData.get('completed') === 'on'
    };
    
    // Update the task
    await api.updateTask(taskId, taskData);
    
    // Close modal and show success message
    editModal.style.display = 'none';
    showToast('Task updated successfully');
    
    // Reload tasks
    loadTasks();
  } catch (error) {
    console.error('Error updating task:', error);
    showToast(`Failed to update task: ${error.message}`, 'error');
  }
}

/**
 * Set up the edit mode for the main form
 * @param {Object} task - The task to edit
 */
function setupEditMode(task) {
  // Set editing state
  isEditing = true;
  currentTaskId = task.id;
  
  // Update form values
  document.getElementById('task-title').value = task.title;
  document.getElementById('task-description').value = task.description || '';
  document.getElementById('task-due-date').value = new Date(task.dueDate).toISOString().split('T')[0];
  
  // Update button text
  submitBtn.textContent = 'Update Task';
  cancelBtn.style.display = 'block';
  
  // Scroll to the form
  taskForm.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Cancel editing and reset the form
 */
function cancelEdit() {
  isEditing = false;
  currentTaskId = null;
  
  // Reset form
  taskForm.reset();
  document.getElementById('task-due-date').value = new Date().toISOString().split('T')[0];
  
  // Update UI
  submitBtn.textContent = 'Add Task';
  cancelBtn.style.display = 'none';
}

// Event Listeners
taskForm.addEventListener('submit', handleFormSubmit);
editForm.addEventListener('submit', handleEditFormSubmit);
filterSelect.addEventListener('change', filterTasks);
searchInput.addEventListener('input', filterTasks);
cancelBtn.addEventListener('click', cancelEdit);

// Modal close button
closeModalBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === editModal) {
    editModal.style.display = 'none';
  }
});