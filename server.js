const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());

// Update this if you're using a persistent disk on Render
const DB_PATH = process.env.NODE_ENV === 'production'
  ? '/mnt/data/songs.sqlite'
  : path.join(__dirname, 'songs.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
  } else {
    console.log(`Connected to SQLite database at ${DB_PATH}`);
  }
});

// Root route to confirm server is alive
app.get('/', (req, res) => {
  res.send('🎶 Lyrics API is running!');
});

// Route to test database connection and return sample data
app.get('/api/test', (req, res) => {
  db.all("SELECT id, title FROM songs LIMIT 5", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Main search route
app.get('/api/search', (req, res) => {
  const q = req.query.q || "";
  db.all(
    `SELECT 
      songs.id,
      songs.title,
      songs.lyrics,
      authors.display_name AS artist
    FROM songs
    LEFT JOIN authors_songs ON songs.id = authors_songs.song_id
    LEFT JOIN authors ON authors.id = authors_songs.author_id
    WHERE songs.title LIKE ? OR authors.display_name LIKE ?`,
    [`%${q}%`, `%${q}%`],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
