const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const DB_PATH = path.join(__dirname, 'songs.sqlite');
const db = new sqlite3.Database(DB_PATH);

app.get('/api/test', (req, res) => {
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
  console.log(`Server running on port ${PORT}`);
});
