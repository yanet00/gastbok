const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ENTRIES_FILE = path.join(__dirname, 'entries.json');

// Use JSON parser for parsing application/json
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for guestbook entries
let guestbookEntries = loadEntries();

// Routes

// Render the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submissions
app.post('/posts', (req, res) => {
  const { name, email, homepage, tel, comment } = req.body;

  // Log form data to check
  console.log('Received form data:', req.body);

  const newEntry = { name, email, homepage, tel, comment };
  guestbookEntries.push(newEntry);

  // Save entries to file
  saveEntries(guestbookEntries);

  // Respond with the updated guestbook entries
  res.json(guestbookEntries);
});

// Get guestbook entries
app.get('/posts', (req, res) => {
  res.json(guestbookEntries);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Function to load entries from the file
function loadEntries() {
  try {
    const entriesData = fs.readFileSync(ENTRIES_FILE, 'utf8');
    return JSON.parse(entriesData);
  } catch (err) {
    console.error('Error loading entries:', err);
    return [];
  }
}

// Function to save entries to the file
function saveEntries(entries) {
  try {
    const entriesData = JSON.stringify(entries, null, 2); // Use null and 2 for formatting
    fs.writeFileSync(ENTRIES_FILE, entriesData, 'utf8');
  } catch (err) {
    console.error('Error saving entries:', err);
  }
}
