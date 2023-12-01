const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ENTRIES_FILE = path.join(__dirname, 'entries.json');


app.use(express.json());

// Servera statiska filer från 'public'-mappen
app.use(express.static(path.join(__dirname, 'public')));
// Ladda befintliga gästboksinlägg vid serverstart
let guestbookEntries = loadEntries();




app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route för att hantera formulärinskick och spara inlägg
app.post('/posts', (req, res) => {
  const { name, email, homepage, tel, comment } = req.body;

  // Logga formulärdata till konsolen för felsökning
  console.log('Received form data:', req.body);

  const newEntry = { name, email, homepage, tel, comment };
  guestbookEntries.push(newEntry);

  // Spara inlägg till fil
  saveEntries(guestbookEntries);

 // Svara med de uppdaterade gästboksinläggen i JSON-format 
  res.json(guestbookEntries);
});

// Route för att hämta gästboksinlägg
app.get('/posts', (req, res) => {
  res.json(guestbookEntries);
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Funktion för att ladda inlägg från filen
function loadEntries() {
  try {
    const entriesData = fs.readFileSync(ENTRIES_FILE, 'utf8');
    return JSON.parse(entriesData);
  } catch (err) {
    console.error('Fel vid inläsning av inlägg:', err);
    return [];
  }
}


// Funktion för att spara inlägg till filen
function saveEntries(entries) {
  try {
    const entriesData = JSON.stringify(entries, null, 2); 
    fs.writeFileSync(ENTRIES_FILE, entriesData, 'utf8');
  } catch (err) {
    console.error('Fel vid sparande av inlägg:', err);
  }
}
