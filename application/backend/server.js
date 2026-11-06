const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Config comes from environment variables (never hard-code secrets)
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "taskuser",
  password: process.env.DB_PASSWORD || "changeme",
  database: process.env.DB_NAME || "taskdb",
});

// Create table on startup (retry until DB is ready)
async function initDb(retries = 10) {
  for (let i = 1; i <= retries; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          done BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW()
        )`);
      console.log("Database ready");
      return;
    } catch (err) {
      console.log(`DB not ready (${i}/${retries}): ${err.message}`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  console.error("Could not connect to database");
  process.exit(1);
}

// Health check (used by Docker / Kubernetes probes)
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "db_unavailable" });
  }
});

// List tasks
app.get("/api/tasks", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
  res.json(rows);
});

// Create task
app.post("/api/tasks", async (req, res) => {
  const title = (req.body.title || "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });
  const { rows } = await pool.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
    [title]
  );
  res.status(201).json(rows[0]);
});

// Toggle done
app.put("/api/tasks/:id", async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE tasks SET done = NOT done WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "not found" });
  res.json(rows[0]);
});

// Delete task
app.delete("/api/tasks/:id", async (req, res) => {
  await pool.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
initDb().then(() => app.listen(PORT, () => console.log(`API running on ${PORT}`)));
