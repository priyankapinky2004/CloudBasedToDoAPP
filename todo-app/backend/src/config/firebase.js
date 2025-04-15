/**
 * Firebase configuration for Todo App backend
 * This module initializes Firebase Admin SDK to interact with Firestore
 */

const admin = require('firebase-admin');
require('dotenv').config();

// Check if we're running in production to determine how to initialize Firebase
let firebaseConfig;

if (process.env.FIREBASE_CONFIG) {
  // For production environment (like Render.com)
  // The service config is provided as an environment variable
  try {
    firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
  } catch (error) {
    console.error('Failed to parse Firebase config:', error);
    process.exit(1);
  }
} else {
  // For local development
  // Uses a local service account key file
  try {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Warning: Running in production but using local Firebase credentials');
    }
    
    // If running locally, use a service account key file
    // Create this file by downloading from Firebase Console
    // IMPORTANT: Never commit this file to version control
    // To generate: Firebase Console -> Project Settings -> Service Accounts -> Generate new private key
    firebaseConfig = require('../../../firebase-service-account.json');
  } catch (error) {
    console.error('Failed to load Firebase service account file:', error);
    console.log('Make sure you have created a firebase-service-account.json file in the project root');
    process.exit(1);
  }
}

// Instructions for setting up Firebase (shown in README, not needed for code)
/*
 * To set up Firebase:
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Go to Project Settings -> Service Accounts
 * 3. Click "Generate new private key" and save the file as "firebase-service-account.json" in project root
 * 4. Set up Firestore Database in Firebase Console
 */

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${firebaseConfig.project_id}-default-rtdb.firebaseio.com`
  });
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  process.exit(1);
}

// Get Firestore instance
const db = admin.firestore();

// Create a tasks collection reference
const tasksCollection = db.collection('tasks');

module.exports = {
  admin,
  db,
  tasksCollection
};