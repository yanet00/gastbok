document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('guestbookform');
  const guestbookEntries = document.getElementById('guestbookentries');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const response = await fetch('/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // If the form submission was successful, update guestbook entries
      updateGuestbook();
      // Optionally, clear the form fields
      form.reset();
    } else {
      console.error('Failed to submit the form.');
    }
  });

  // Function to fetch and update guestbook entries
  const updateGuestbook = async () => {
    const response = await fetch('/posts');
    const entries = await response.json();

    // Update the guestbook entries on the page
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

  // Initial update when the page loads
  updateGuestbook();
});
