Sticky Notes 📝

A modern, feature-rich sticky notes web application that allows users to create, manage, and organize their notes with a clean and intuitive interface.

Features ✨
Authentication & User Management

Secure email/password authentication system
User registration with password requirements
Password reset functionality
Custom profile picture upload via Cloudinary
Persistent user sessions

Note Management

Create, read, update, and delete notes
Rich text editing for note content
Automatic timestamps for all notes
Note locking with PIN protection
Real-time note saving

Search & Organization

Search notes by title
Filter notes by date
Date picker for precise filtering
Clear search/filter functionality
Chronological note ordering

User Interface

Responsive design for all screen sizes
Dark/Light theme toggle with persistence
Smooth animations and transitions
Scroll-to-top functionality
Clean and modern Material Design icons
Intuitive navigation
Empty state handling with placeholder
Loading states and error handling

Security Features

Secure authentication via Firebase
Protected routes and data access
PIN-protected note locking
Secure password requirements
Safe data deletion confirmation

Technology Stack 🛠️
Frontend

HTML5
CSS3 with Flexbox/Grid
Vanilla JavaScript
Font Awesome icons
Flatpickr date picker

Backend & Services

Firebase Authentication
Firebase Firestore Database
Cloudinary Image Storage
Real-time data synchronization

Integrations

Firebase SDK
Cloudinary Upload API
Flatpickr Library

Installation & Setup 🚀

Clone the repository
Set up Firebase:

Create a new Firebase project
Enable Email/Password authentication
Create a Firestore database
Update the Firebase configuration in index.js


Set up Cloudinary:

Create a Cloudinary account
Update the Cloudinary configuration in index.js
Set up the upload preset for profile images


Install dependencies:
htmlCopy<!-- Add to index.html -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

Run the application using a local server

Usage Guide 📘

Getting Started

Click "GET STARTED" to open the authentication modal
Register with email and password or log in to existing account
Optional: Upload a profile picture


Creating Notes

Click "Add Note" to create a new note
Enter title and content
Click save icon to store the note


Managing Notes

Lock/unlock notes with PIN protection
Delete notes using trash icon
Edit notes by clicking on content
Save changes using save icon


Searching & Filtering

Use search bar to find notes by title
Click calendar icon to filter by date
Clear filters using the clear icon


Customization

Toggle between dark/light themes
Customize profile picture
Organize notes by date or title



Security Considerations 🔒

Implement strong password requirements
PIN protection for sensitive notes
Secure data storage in Firestore
Protected user data access
Safe image upload handling
Secure authentication flow

Browser Support 🌐

Chrome (latest)
Firefox (latest)
Safari (latest)
Edge (latest)
Responsive design for mobile devices

Contributing 🤝

Fork the repository
Create a feature branch
Commit your changes
Push to the branch
Open a pull request

License 📄
This project is licensed under the MIT License - see the LICENSE file for details.
Contact 📧
For support or queries, contact: info.support@stickynotes.com
