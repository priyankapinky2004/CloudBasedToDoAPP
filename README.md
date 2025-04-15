# Cloud-Based To-Do List Web App

A simple, full-stack to-do list application built using vanilla HTML, CSS, and JavaScript for the frontend, Node.js with Express for the backend, and Firebase for cloud database storage.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Task Properties**: Title, description, due date, and completion status
- **Filtering**: Filter tasks by status (all, pending, completed)
- **Search**: Search tasks by title or description
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **Cloud Storage**: Tasks are stored in Firebase and persist across devices

## Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Font Awesome (for icons)

### Backend
- Node.js
- Express.js
- Firebase Firestore (for database)

### Deployment
- Frontend: Netlify (free tier)
- Backend: Render.com (free tier)
- Database: Firebase (free tier, no credit card required)

## Project Structure

```
todo-app/
│
├── frontend/                  # Vanilla HTML/CSS/JS frontend
│   ├── index.html             # Main HTML file
│   ├── css/                   # CSS styles
│   │   └── style.css
│   ├── js/                    # JavaScript files
│   │   ├── app.js             # Main application logic
│   │   └── api.js             # API communication
│   └── README.md              # Frontend setup instructions
│
├── backend/                   # Node.js Express backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   │   └── taskController.js
│   │   ├── routes/            # API routes
│   │   │   └── taskRoutes.js
│   │   ├── config/            # Configuration files
│   │   │   └── firebase.js    # Firebase configuration
│   │   └── server.js          # Express server setup
│   ├── package.json           # Backend dependencies
│   └── README.md              # Backend setup instructions
│
└── README.md                  # Main project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- A free Firebase account
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/priyankapinky2004/CloudBasedToDoAPP.git
cd todo-app
```

### Step 2: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (no need for Google Analytics)
3. From the project dashboard, go to "Project settings" > "Service accounts"
4. Click "Generate new private key" and save the file as `firebase-service-account.json` in the `backend` directory
5. Go to "Build" > "Firestore Database" > "Create database"
6. Choose "Start in test mode" (for development purposes)

### Step 3: Set Up the Backend

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create .env file from the sample
cp .env.sample .env

# Start the development server
npm run dev
```

The server should now be running at http://localhost:5000

### Step 4: Set Up the Frontend

The frontend is static HTML, CSS, and JavaScript. You can simply open the `frontend/index.html` file in your browser, or use a local development server like:

```bash
# Using Node.js http-server (you might need to install it first with npm install -g http-server)
cd frontend
http-server

# Or using Python's built-in HTTP server
cd frontend
python -m http.server 8080
```

Then open your browser to http://localhost:8080 (or whatever port your server is using).

## Deployment Instructions

### Deploy the Frontend (Netlify)

1. Create a free account on [Netlify](https://www.netlify.com/)
2. From Netlify dashboard, click "New site from Git"
3. Connect to your GitHub repository
4. Set the build command to: `echo "No build required"`
5. Set the publish directory to: `frontend`
6. Click "Deploy site"

### Deploy the Backend (Render.com)

1. Create a free account on [Render.com](https://render.com/)
2. From the dashboard, click "New Web Service"
3. Connect to your GitHub repository
4. Set the build command to: `npm install`
5. Set the start command to: `node src/server.js`
6. Add the environment variables from your `.env` file, including the `FIREBASE_CONFIG` with your Firebase service account JSON as a string
7. Click "Create Web Service"

### Connect Everything

Once deployed, update the API base URL in `frontend/js/api.js` to point to your deployed backend:

```javascript
const API_BASE_URL = 'https://your-backend-app.onrender.com/api';
```

Then redeploy the frontend.

## Extending the Project

Here are some ideas to enhance the project:

1. **User Authentication**: Add Firebase Authentication for user login
2. **Categories/Tags**: Add ability to categorize tasks
3. **Due Date Notifications**: Add browser notifications for upcoming tasks
4. **Task Priorities**: Add priority levels for tasks
5. **Data Export/Import**: Allow exporting and importing task data
6. **Subtasks**: Add the ability to create subtasks
7. **Drag-and-Drop Reordering**: Allow reordering tasks via drag and drop

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Firebase](https://firebase.google.com/) for the free database
- [Font Awesome](https://fontawesome.com/) for icons
- [Netlify](https://www.netlify.com/) and [Render.com](https://render.com/) for free hosting
