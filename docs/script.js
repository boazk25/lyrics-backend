async function searchLyrics() {
    const query = document.getElementById('searchInput').value.trim();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
  
    if (!query) {
      resultsDiv.innerHTML = '<p>Please enter a search term.</p>';
      return;
    }
  
    try {
      const res = await fetch(`https://songsearchapp.glitch.me/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
  
      if (data.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
      }
  
      data.forEach(song => {
        const songEl = document.createElement('div');
        songEl.className = 'song';
        songEl.innerHTML = `
          <h3>${song.title} <small>by ${song.artist}</small></h3>
          <pre>${song.lyrics}</pre>
        `;
        resultsDiv.appendChild(songEl);
      });
    } catch (err) {
      resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
    }
  }
  