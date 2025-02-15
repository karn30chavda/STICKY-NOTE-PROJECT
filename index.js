import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, deleteDoc, getDoc, setDoc, orderBy } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCa6NZ9lG0g98vWl1iQCM6ovbXDiivTX2g",
  authDomain: "sticky-notes-65cf4.firebaseapp.com",
  databaseURL: "https://sticky-notes-65cf4-default-rtdb.firebaseio.com",
  projectId: "sticky-notes-65cf4",
  storageBucket: "sticky-notes-65cf4.firebasestorage.app",
  messagingSenderId: "553422297292",
  appId: "1:553422297292:web:2938b1b8a54df5dd310a69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI Elements
const addBtn = document.querySelector("#addBtn");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const main = document.querySelector("#main");
const loginModal = document.querySelector("#loginModal");
const closeModal = document.querySelector(".close");
const signupLink = document.querySelector("#signupLink");
const loginLink = document.querySelector("#loginLink");
const authForm = document.querySelector("#authForm");
const signupForm = document.querySelector("#signupForm");
const loginForm = document.querySelector("#loginForm");
const welcomeSection = document.querySelector("#welcomeSection");
const themeToggle = document.querySelector("#themeToggle");
const admin_icon = document.querySelector("#admin-icon");
const userProfileImage = document.getElementById('userProfileImage');
const searchContainer = document.getElementById('searchContainer');
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const body = document.body;

let currentUserEmail = null;

// Initialize Flatpickr
const datePicker = flatpickr("#datePicker", {
  dateFormat: "Y-m-d",
  disableMobile: true,
  onChange: function (selectedDates, dateStr) {
    if (selectedDates.length > 0) {
      searchNotesByDate(selectedDates[0]);
      document.getElementById('clearDateFilter').classList.add('visible');
    }
  }
});

// Clear date filter handler
document.getElementById('clearDateFilter').addEventListener('click', () => {
  datePicker.clear();
  currentSelectedDate = null;
  document.getElementById('clearDateFilter').classList.remove('visible');
  filterNotes();
});

// Calendar icon click handler
document.getElementById('calendarIcon').addEventListener('click', () => {
  datePicker.open();
});

// Search state variables
let currentSearchTerm = '';
let currentSelectedDate = null;

// Search functionality
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', function () {
  currentSearchTerm = this.value.trim().toLowerCase();
  filterNotes();
});

// Filter notes function
function filterNotes() {
  const notes = document.querySelectorAll('.note');
  notes.forEach(note => {
    const title = note.querySelector('.title-div textarea').value.toLowerCase();
    const noteDate = new Date(note.querySelector('.date-time').dataset.date);
    const matchesTitle = title.includes(currentSearchTerm);
    const matchesDate = currentSelectedDate ?
      noteDate.toDateString() === currentSelectedDate.toDateString() : true;

    note.style.display = (matchesTitle && matchesDate) ? 'flex' : 'none';
  });

  // Update calendar icon color based on filter state
  const calendarIcon = document.getElementById('calendarIcon');
  if (currentSelectedDate) {
    calendarIcon.style.color = '#0078d7';
  } else {
    calendarIcon.style.color = body.classList.contains('dark-mode') ? '#888' : '#666';
  }
}

// Date search handler
function searchNotesByDate(date) {
  currentSelectedDate = date;
  filterNotes();
  // Update calendar icon color to indicate active filter
  document.getElementById('calendarIcon').style.color = '#0078d7';
}

// Password validation function
const validatePassword = (password) => {
  const minLength = 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasLetter &&
    hasNumber &&
    hasSpecialChar
  );
};

// Auth State Change Listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is logged in:", user.email);
    currentUserEmail = user.email;
    toggleLoginState();
    loadUserNotes();
    try {
      await loadProfileImage();
    } catch (error) {
      console.error("Error loading profile image:", error);
      userProfileImage.src = 'images/admin_icon.png';
    }
  } else {
    console.log("No user is logged in.");
    currentUserEmail = null;
    toggleLoginState();
    userProfileImage.src = 'images/admin_icon.png';
  }
});

// Toggle login state
const toggleLoginState = () => {
  if (currentUserEmail) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    addBtn.style.display = "inline-block";
    welcomeSection.style.display = "none";
    admin_icon.style.display = "block";
    searchContainer.style.display = 'flex';
  } else {
    logoutBtn.style.display = "none";
    loginBtn.style.display = "inline-block";
    addBtn.style.display = "none";
    welcomeSection.style.display = "flex";
    admin_icon.style.display = "none";
    searchContainer.style.display = 'none';
  }
};

// Sign Up Logic with Password Validation
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const signupEmail = document.querySelector("#signupEmail").value;
  const signupPassword = document.querySelector("#signupPassword").value;

  if (!validatePassword(signupPassword)) {
    alert("Password must be at least 8 characters long, contain at least one letter, one number, and one special symbol.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
    alert("You are now signed up!");
    currentUserEmail = userCredential.user.email;
    toggleLoginState();
    loginModal.style.display = "none";
  } catch (error) {
    alert(error.message);
  }
});

// Login Logic
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const loginEmail = document.querySelector("#loginEmail").value;
  const loginPassword = document.querySelector("#loginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    alert("You are now logged in!");
    currentUserEmail = userCredential.user.email;
    toggleLoginState();
    loginModal.style.display = "none";
  } catch (error) {
    alert("Invalid email or password. Please try again.");
  }
});

// Logout Logic
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("You are now logged out!");
    toggleLoginState();
    clearNotes();
  } catch (error) {
    alert("Error logging out: " + error.message);
  }
});

// Clear Notes from UI
const clearNotes = () => {
  main.innerHTML = "";
};

// Show login modal when login button is clicked
loginBtn.addEventListener("click", () => {
  loginModal.style.display = "block";
});

// Close modal when clicking the 'X' button
closeModal.addEventListener("click", () => {
  loginModal.style.display = "none";
});

// Close modal when clicking outside modal content
window.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.style.display = "none";
  }
});

// Switch to Signup Form
signupLink.addEventListener("click", () => {
  authForm.style.display = "none";
  signupForm.style.display = "block";
});

// Switch to Login Form
loginLink.addEventListener("click", () => {
  signupForm.style.display = "none";
  authForm.style.display = "block";
});

// Password Reset Functionality
document.getElementById('forgot-password').addEventListener('click', function (event) {
  event.preventDefault();
  const email = prompt("Please enter your email address for password reset:");
  if (email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent. Please check your email.");
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
        alert("Error: " + error.message);
      });
  } else {
    alert("Email address is required!");
  }
});

// Load User Notes
const loadUserNotes = async () => {
  try {
    const notesRef = collection(db, "notes");
    const q = query(
      notesRef,
      where("userEmail", "==", currentUserEmail),
      orderBy("createdAt", "desc") 
    );
    const querySnapshot = await getDocs(q);
    main.innerHTML = ""; // Clear existing notes
    querySnapshot.forEach((doc) => {
      const noteData = { id: doc.id, ...doc.data() };
      renderNote(noteData); // Render each note
    });
    checkAndShowPlaceholder();
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
};

// Render Note Function
const renderNote = (noteData) => {
  const note = document.createElement("div");
  note.className = `note ${noteData.locked ? 'locked-note' : ''}`;
  note.setAttribute("data-id", noteData.id);
  const noteDate = noteData.createdAt?.toDate();
  
  note.innerHTML = `
    <div class="icons">
    <i class="fas fa-trash delete"></i>
      <i class="fas fa-lock ${noteData.locked ? 'locked' : ''}"></i>
      <i class="fas fa-save save"></i>
    </div>
    <div class="title-div">
      <textarea placeholder="Title" ${noteData.locked ? 'readonly' : ''}>${noteData.title || ""}</textarea>
    </div>
    <textarea placeholder="Take a note..." ${noteData.locked ? 'readonly' : ''}>${noteData.content || ""}</textarea>
    <div class="date-time" data-date="${noteDate.toISOString()}">
      ${noteDate.toLocaleString()}
    </div>
  `;

  // Add event listeners
  addNoteListeners(note);
  
  main.appendChild(note);
};

// Add Note Listeners
const addNoteListeners = (noteElement) => {
  const saveBtn = noteElement.querySelector(".save");
  const deleteBtn = noteElement.querySelector(".delete");
  const title = noteElement.querySelector(".title-div textarea");
  const content = noteElement.querySelector("textarea:not(.title-div textarea)");
  const lockIcon = noteElement.querySelector('.fa-lock');

  // Lock/unlock functionality
  lockIcon.addEventListener('click', async () => {
    const noteId = noteElement.getAttribute('data-id');
    const isLocked = noteElement.classList.contains('locked-note');

    if (!isLocked) {
      const pin = prompt('Set a 4-digit PIN for this note:');
      if (pin && pin.length === 4 && !isNaN(pin)) {
        await toggleNoteLock(noteId, true, pin);
        noteElement.classList.add('locked-note');
        noteElement.querySelectorAll('textarea:not(.title-div textarea)').forEach(t => {
          t.readOnly = true;
          t.style.filter = 'blur(5px)';
        });
        lockIcon.classList.add('locked');
      }
    } else {
      const noteDoc = await getDoc(doc(db, "notes", noteId));
      const storedPin = noteDoc.data().pin;
      
      const enteredPin = prompt('Enter PIN to unlock:');
      if (enteredPin === storedPin) {
        await toggleNoteLock(noteId, false);
        noteElement.classList.remove('locked-note');
        noteElement.querySelectorAll('textarea').forEach(t => {
          t.readOnly = false;
          t.style.filter = 'none';
        });
        lockIcon.classList.remove('locked');
      } else {
        alert('Incorrect PIN!');
      }
    }
  });

  // Delete Note handler
  deleteBtn.addEventListener("click", async () => {
    const isLocked = lockIcon.classList.contains('locked');
    
    if (isLocked) {
      const noteId = noteElement.getAttribute('data-id');
      const noteDoc = await getDoc(doc(db, "notes", noteId));
      const storedPin = noteDoc.data().pin;
      
      const enteredPin = prompt('Enter note PIN to delete:');
      if (enteredPin !== storedPin) {
        alert('Incorrect PIN! Deletion canceled.');
        return;
      }
    } else {
      const isConfirmed = confirm("Are you sure you want to delete this note?");
      if (!isConfirmed) return;
    }

    const noteId = noteElement.getAttribute("data-id");
    if (noteId) {
      await deleteNoteFromFirestore(noteId);
    }
    noteElement.remove();
    showAllNotes();
  });

  // Modified Save Note handler
  saveBtn.addEventListener("click", async () => {
    const isLocked = lockIcon.classList.contains('locked');
    
    if (isLocked) {
      alert("Note is locked! Unlock the note first to make changes.");
      return;
    }

    const isConfirmed = confirm("Are you sure you want to save this note?");
    if (isConfirmed) {
      const noteId = noteElement.getAttribute("data-id");
      
      // Delete old version silently if exists
      if (noteId) {
        await deleteNoteFromFirestore(noteId);
      }

      // Save new version
      const newNoteId = await saveNoteToFirestore(title.value, content.value);
      if (newNoteId) {
        noteElement.setAttribute("data-id", newNoteId);
        alert("Note saved successfully!");
        location.reload();
        showAllNotes();
      }
    }
  });
};

// Save Note to Firestore
const saveNoteToFirestore = async (title, content) => {
  try {
    const docRef = await addDoc(collection(db, "notes"), {
      title,
      content,
      userEmail: currentUserEmail,
      createdAt: new Date(),
      locked: false
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving note:", error);
  }
};

// Toggle Note Lock
const toggleNoteLock = async (noteId, lockState, pin) => {
  try {
    const noteRef = doc(db, "notes", noteId);
    await setDoc(noteRef, { 
      locked: lockState,
      ...(lockState && { pin: pin }) 
    }, { merge: true });
  } catch (error) {
    console.error("Error updating lock status:", error);
  }
};

// Delete Note from Firestore
const deleteNoteFromFirestore = async (noteId) => {
  try {
    await deleteDoc(doc(db, "notes", noteId));
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};

// Add New Note
addBtn.addEventListener("click", () => {
  createNewNote();
});

const createNewNote = () => {
  // Hide all existing notes
  document.querySelectorAll('.note').forEach(note => {
    note.style.display = "none";
  });

  const note = document.createElement("div");
  note.className = "note";
  note.innerHTML = `
    <div class="icons">
    <i class="fas fa-trash delete"></i>
      <i class="fas fa-lock"></i>
      <i class="fas fa-save save"></i>
    </div>
    <div class="title-div">
      <textarea placeholder="Write the Title ..."></textarea>
    </div>
    <textarea placeholder="Note down your thoughts ..."></textarea>
    <div class="date-time">${new Date().toLocaleString()}</div>
  `;

  // Insert at the top
  main.insertBefore(note, main.firstChild);

  // Focus on the new note
  const titleTextarea = note.querySelector('.title-div textarea');
  titleTextarea.focus();
  note.scrollIntoView({ behavior: 'smooth', block: 'start' });

  addNoteListeners(note);
  checkAndShowPlaceholder();
};

// Function to show a placeholder when no notes are available
const showNoNotesPlaceholder = () => {
  const placeholder = document.createElement("div");
  placeholder.className = "no-notes-placeholder";
  placeholder.innerHTML = `
    <i class="fas fa-sticky-note"></i>
    <p>No notes available. Click the "Add Note" button to create one!</p>
  `;
  main.appendChild(placeholder);
};

// Function to check if notes exist and show/hide the placeholder
const checkAndShowPlaceholder = () => {
  const notes = document.querySelectorAll(".note");
  const placeholder = document.querySelector(".no-notes-placeholder");

  if (notes.length === 0) {
    if (!placeholder) {
      showNoNotesPlaceholder();
    }
  } else {
    if (placeholder) {
      placeholder.remove();
    }
  }
};

// Update Theme Icon
const updateThemeIcon = (theme) => {
  const icon = themeToggle.querySelector("i");
  if (theme === "light-mode") {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
};

// Theme Toggle Logic
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.classList.add(savedTheme);
  updateThemeIcon(savedTheme);
} else {
  body.classList.add("dark-mode"); // Default to dark mode
  updateThemeIcon("dark-mode");
}

themeToggle.addEventListener("click", () => {
  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    localStorage.setItem("theme", "light-mode");
    updateThemeIcon("light-mode");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark-mode");
    updateThemeIcon("dark-mode");
  }
});

// Toggle Password Visibility
document.getElementById('togglePassword').addEventListener('click', function () {
  const passwordField = document.getElementById('loginPassword');
  const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordField.setAttribute('type', type);
  this.classList.toggle('fa-eye-slash');
});

document.getElementById('toggleSignupPassword').addEventListener('click', function () {
  const passwordField = document.getElementById('signupPassword');
  const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordField.setAttribute('type', type);
  this.classList.toggle('fa-eye-slash');
});

// Cloudinary Configuration
const cloudinaryCloudName = "dzvkiiinm";
const cloudinaryUploadPreset = "profile_images";

// Profile Image Upload Event Listener
document.getElementById('profileImageUpload').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryUploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.secure_url) {
        const imageUrl = data.secure_url;
        await saveProfileImageToFirestore(imageUrl);
        userProfileImage.src = imageUrl;
        alert('Profile image uploaded successfully!');
      } else {
        console.error('Cloudinary upload failed:', data);
        alert('Error uploading profile image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      alert('Error uploading profile image. Please try again.');
    }
  }
});

// Save/Update Profile Image URL to Firestore
const saveProfileImageToFirestore = async (downloadURL) => {
  try {
    const userDocRef = doc(db, "users", currentUserEmail);
    await setDoc(userDocRef, { profileImage: downloadURL }, { merge: true });
  } catch (error) {
    console.error("Error saving profile image to Firestore:", error);
    alert("Error saving profile image. Please try again.");
  }
};

// Load Profile Image from Firestore
const loadProfileImage = async () => {
  try {
    const userDocRef = doc(db, "users", currentUserEmail);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const profileImage = userData.profileImage;
      if (profileImage) {
        userProfileImage.src = profileImage;
      } else {
        userProfileImage.src = 'images/admin_icon.png';
      }
    } else {
      userProfileImage.src = 'images/admin_icon.png';
    }
  } catch (error) {
    console.error("Error loading profile image from Firestore:", error);
    userProfileImage.src = 'images/admin_icon.png';
  }
};

// Show/hide the button based on scroll position
window.onscroll = function () {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
};

// Scroll to the top with smooth scrolling when the button is clicked
scrollToTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  // Change the button color back to primary after reaching the top
  setTimeout(() => {
    scrollToTopBtn.style.backgroundColor = "#D4A373";
  }, 500);
});

// Focus on the contact link when clicked 
document.getElementById('contact-link').addEventListener('click', function (e) {
  setTimeout(() => {
    this.blur();
  }, 0);

  this.style.transition = 'color 0.3s ease';
});

// Function to show all hidden notes
const showAllNotes = () => {
  document.querySelectorAll('.note').forEach(note => {
    note.style.display = "flex";
  });
};