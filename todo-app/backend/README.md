# Todo App Backend

This is the backend for the Todo App, built with Node.js, Express, and Firebase Firestore.

## Structure

- `src/server.js` - The main Express server setup
- `src/routes/taskRoutes.js` - API route definitions
- `src/controllers/taskController.js` - Business logic for handling tasks
- `src/config/firebase.js` - Firebase configuration and initialization

## Prerequisites

- Node.js (v18 or higher)
- A free Firebase account
- Firebase project with Firestore database

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (no need for Google Analytics)
3. From the project dashboard, go to "Project settings" > "Service accounts"
4. Click "Generate new private key" and save the file as `firebase-service-account.json` in the project root directory (same level as `package.json`)
5. Go to "Build" > "Firestore Database" > "Create database"
6. Choose "Start in test mode" (for development purposes)

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development
```

The Firebase configuration will be loaded from the service account file you saved.

### 4. Run the Server

For development with auto-restart on file changes:

```bash
npm run dev
```

For production:

```bash
npm start
```

The server should now be running at http://localhost:5000

## API Endpoints

The API follows RESTful conventions and supports the following endpoints:

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/status` - Toggle task completion status

## Request and Response Examples

### Creating a Task

**Request:**

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the Todo App project",
  "dueDate": "2023-12-31T23:59:59.999Z"
}
```

**Response:**

```json
{
  "id": "a1b2c3d4",
  "title": "Complete project",
  "description": "Finish the Todo App project",
  "dueDate": "2023-12-31T23:59:59.999Z",
  "completed": false,
  "createdAt": "2023-09-15T14:30:45.123Z"
}
```

### Updating a Task

**Request:**

```http
PUT /api/tasks/a1b2c3d4
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Updated description",
  "dueDate": "2023-12-31T23:59:59.999Z",
  "completed": true
}
```

**Response:**

```json
{
  "id": "a1b2c3d4",
  "title": "Complete project",
  "description": "Updated description",
  "dueDate": "2023-12-31T23:59:59.999Z",
  "completed": true,
  "updatedAt": "2023-09-16T09:12:34.567Z"
}
```

## Deployment to Render.com

To deploy to Render.com:

1. Create a free account on [Render.com](https://render.com/)
2. From the dashboard, click "New Web Service"
3. Connect to your GitHub repository
4. Configure the service:
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
5. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render uses this automatically)
   - `FIREBASE_CONFIG`: Paste your entire Firebase service account JSON as a string

6. Click "Create Web Service"

### CORS Configuration

By default, the server is configured to accept requests from:
- `http://localhost:3000` (local development)
- Your production frontend domain

If you need to allow requests from additional domains, update the `corsOptions` in `src/server.js`.

## Security Considerations

- The Firebase Firestore is set up in test mode for development. For production, you should set up proper security rules.
- Do NOT commit your `firebase-service-account.json` file to version control.
- Use environment variables for all sensitive information.

## Extension Ideas

Here are some ideas to extend the backend:

1. **User Authentication**: Integrate Firebase Authentication
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Pagination**: Add pagination for the GET /tasks endpoint
4. **Logging**: Implement a more robust logging system
5. **Testing**: Add unit and integration tests
6. **Documentation**: Add Swagger/OpenAPI documentation
