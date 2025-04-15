# Todo App Frontend

This is the frontend for the Todo App, built with vanilla HTML, CSS, and JavaScript.

## Structure

- `index.html` - The main HTML file that structures the app
- `css/style.css` - Contains all styling for the application
- `js/app.js` - Main application logic and UI interactions
- `js/api.js` - Handles API communication with the backend

## Local Development

Since this is a plain HTML/CSS/JS application, you can run it locally in several ways:

### Option 1: Open directly in browser

Simply open the `index.html` file in your web browser.

### Option 2: Use a local development server

If you want to use a development server (recommended for avoiding CORS issues):

#### Using Node.js http-server

```bash
# Install http-server globally if you don't have it
npm install -g http-server

# Run the server in the frontend directory
http-server -p 3000
```

#### Using Python's built-in server

```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

Then open your browser to `http://localhost:3000`

## API Configuration

The app is configured to communicate with the backend API. By default, it points to a local development server:

```javascript
// In js/api.js
const API_BASE_URL = 'http://localhost:5000/api';
```

For production, you'll need to update this to your deployed backend URL:

```javascript
const API_BASE_URL = 'https://your-backend-app.onrender.com/api';
```

## Deployment to Netlify

To deploy to Netlify:

1. Create a free account on [Netlify](https://www.netlify.com/)
2. From Netlify dashboard, select "New site from Git" or just drag and drop the `frontend` folder to the Netlify dashboard
3. If using Git deployment:
   - Connect to your GitHub repository
   - Set the build command to: `echo "No build required"`
   - Set the publish directory to: `frontend`
4. Click "Deploy site"

## Customization

### Changing Colors and Theme

The app uses CSS variables for theming. You can modify the colors in the `css/style.css` file:

```css
:root {
  --primary-color: #4a6fa5;
  --primary-dark: #3a5985;
  /* ... other variables ... */
}

/* Dark theme variables */
body.dark-theme {
  --primary-color: #5c88c5;
  /* ... other dark theme variables ... */
}
```

### Adding New Features

The app is structured in a way that makes it easy to add new features:

1. **Add new UI elements** in `index.html`
2. **Style the elements** in `css/style.css`
3. **Add interactivity** in `js/app.js`
4. If needed, **update API communications** in `js/api.js`

## Browser Compatibility

The app is designed to work in all modern browsers (Chrome, Firefox, Safari, Edge). It uses ES6+ JavaScript features, so older browsers may need transpilers like Babel for full compatibility.
