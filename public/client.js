document.addEventListener('DOMContentLoaded', () => {
  // Hämta formuläret och gästboksinläggsområdet från DOM
  const form = document.getElementById('guestbookform');
  const guestbookEntries = document.getElementById('guestbookentries');

  // Lägg till en händelselyssnare för formulärsubmission
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Skapa en FormData-objekt från formuläret
    const formData = new FormData(form);
    const data = {};
    // Konvertera FormData till vanligt objekt
    formData.forEach((value, key) => {
      data[key] = value;
    });
// Skicka formulärdata till servern med Fetch API
    const response = await fetch('/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
 // Kontrollera om formulärsubmissionen var framgångsrik
    if (response.ok) {
      // Uppdatera gästboksinlägg och återställ formuläret
      updateGuestbook();
      
      form.reset();
    } else {
      console.error('Misslyckades med att skicka formuläret.');
    }
  });

 // Funktion för att uppdatera gästboksinlägg
  const updateGuestbook = async () => {
     // Hämta gästboksinlägg från servern med Fetch API
  const response = await fetch('/posts');
  const entries = await response.json();

// Uppdatera DOM med de hämtade gästboksinläggen
    guestbookEntries.innerHTML = entries.map(entry => {
      return `<div class="entry">
      <p><b>Namn:</b> ${entry.name}</p>
      <p><b>E-post:</b> ${entry.email}</p>
      <p><b>Homepage:</b> ${entry.homepage || "ingen hemsida"}</p>
      <p><b>Telefon:</b> ${entry.tel || "ingen telefon"}</p>
      <p><b>Kommentar:</b> ${entry.comment}</p>
      <hr>
    </div>`;
    }).join('');
  };
  // Uppdatera gästboksinlägg när sidan laddas
  updateGuestbook();
});
