document.getElementById('mood-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const mood = document.getElementById('mood').value;
    if (!mood) return alert('Please select a mood!');
  
    const playlistContainer = document.querySelector('.playlist');
    playlistContainer.innerHTML = '<p>Loading songs...</p>';
  
    try {
      const res = await fetch('/.netlify/functions/getTrack', {
        method: 'POST',
        body: JSON.stringify({ mood }),
      });
      const data = await res.json();
  
      if (data.error) throw new Error(data.error);
  
      playlistContainer.innerHTML = data.tracks
        .map(
          (t) => `
          <div class="song-card">
            <img src="${t.albumCover || 'https://via.placeholder.com/100'}" alt="Album cover">
            <p><strong>${t.name}</strong><br><span>${t.artist}</span></p>
            <a href="${t.url}" target="_blank">Open in Spotify</a>
          </div>`
        )
        .join('');
    } catch (err) {
      console.error(err);
      playlistContainer.innerHTML = '<p>Failed to load playlist.</p>';
    }
  });
  