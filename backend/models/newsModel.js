import db from "../config/db.js";

const createTable = async () => {
  await db.none(`
    CREATE TABLE IF NOT EXISTS news (
      id SERIAL PRIMARY KEY,
      title TEXT UNIQUE NOT NULL,
      description TEXT,
      url TEXT NOT NULL,
      image TEXT,
      source TEXT,
      category TEXT,
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const insertArticle = async (article) => {
  const { title, description, url, image, source, category, published_at } =
    article;
  try {
    await db.none(
      `INSERT INTO news (title, description, url, image, source, category, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (title) DO NOTHING`,
      [title, description, url, image, source, category, published_at]
    );
  } catch (error) {
    console.error("Error inserting article:", error.message);
  }
};

const getNewsByCategory = async (category) => {
  return db.any(
    "SELECT * FROM news WHERE category = $1 ORDER BY published_at DESC",
    [category]
  );
};

export { createTable, insertArticle, getNewsByCategory };
