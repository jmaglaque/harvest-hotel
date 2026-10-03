const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// configure DB connection with environment variables support
const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
  user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'harvest_hotel',
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Enable SSL if running on cloud MySQL (e.g. TiDB, Aiven, PlanetScale)
if (
  process.env.DB_SSL === 'true' || 
  process.env.TIDB_ENABLE_SSL === 'true' || 
  (process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud')) ||
  process.env.NODE_ENV === 'production'
) {
  dbConfig.ssl = {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false
  };
}

const pool = mysql.createPool(dbConfig);

// Auto-initialize table and sample seed data if not yet created
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT NOT NULL AUTO_INCREMENT,
        roomId VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        date VARCHAR(255) DEFAULT NULL,
        rating INT DEFAULT NULL,
        comment TEXT DEFAULT NULL,
        PRIMARY KEY (id)
      )
    `);
    
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM reviews');
    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO reviews (roomId, name, date, rating, comment) VALUES
        ('superior-twin', 'Juan Dela Cruz', 'Oct 2, 2026', 5, 'Napaka-comfortable ng beds at malamig ang aircon!'),
        ('superior-queen', 'Maria Santos', 'Oct 3, 2026', 4, 'Very accessible and cozy room. Babalik kami!'),
        ('deluxe-room', 'Carlos Reyes', 'Oct 1, 2026', 5, 'Relaxing staycation with the family.')
      `);
      console.log('Default seed reviews created.');
    }
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Error auto-initializing DB:', err.message);
  }
}
initDb();

// Health check endpoint for cloud monitoring (Render, UptimeRobot, etc.)
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', uptime: process.uptime() });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});
app.get('/', (req, res) => res.send('Harvest Hotel API is running!'));

// GET reviews for a room
app.get('/api/rooms/:roomId/reviews', async (req, res) => {
  const { roomId } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM reviews WHERE roomId = ? ORDER BY id DESC', [roomId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error', details: err.message });
  }
});

// POST add review
app.post('/api/rooms/:roomId/reviews', async (req, res) => {
  const { roomId } = req.params;
  const { name, date, rating, comment } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO reviews (roomId, name, date, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [roomId, name, date, rating, comment]
    );
    const insertedId = result.insertId;
    const [rows] = await pool.execute('SELECT * FROM reviews WHERE id = ?', [insertedId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error', details: err.message });
  }
});

// PUT update review
app.put('/api/rooms/:roomId/reviews/:id', async (req, res) => {
  const { id, roomId } = req.params;
  const { name, date, rating, comment } = req.body;
  try {
    await pool.execute(
      'UPDATE reviews SET name = ?, date = ?, rating = ?, comment = ? WHERE id = ? AND roomId = ?',
      [name, date, rating, comment, id, roomId]
    );
    const [rows] = await pool.execute('SELECT * FROM reviews WHERE id = ? AND roomId = ?', [id, roomId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// DELETE review
app.delete('/api/rooms/:roomId/reviews/:id', async (req, res) => {
  const { id, roomId } = req.params;
  try {
    await pool.execute('DELETE FROM reviews WHERE id = ? AND roomId = ?', [id, roomId]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));