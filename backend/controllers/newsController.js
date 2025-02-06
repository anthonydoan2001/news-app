import axios from "axios";
import redisClient from "../config/redis.js";
import { insertArticle, getNewsByCategory } from "../models/newsModel.js"; // ✅ Fixed missing import

const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";
const CATEGORIES = ["technology", "sports", "business", "science"];

/**
 * Fetches news articles from NewsAPI and stores them in the database.
 */
const fetchAndStoreNews = async () => {
  try {
    for (const category of CATEGORIES) {
      console.log(`🔍 Fetching news for category: ${category}`);

      const response = await axios.get(NEWS_API_URL, {
        params: {
          category,
          country: "us",
          apiKey: process.env.NEWS_API_KEY,
        },
      });

      if (!response.data.articles || response.data.articles.length === 0) {
        console.warn(`⚠️ No articles found for ${category}`);
        continue;
      }

      const articles = response.data.articles.map((article) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.urlToImage,
        source: article.source.name,
        category,
        published_at: article.publishedAt,
      }));

      for (const article of articles) {
        await insertArticle(article);
      }
    }
    console.log("✅ News updated successfully.");
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
  }
};

/**
 * Retrieves news articles from the database or cache.
 */
const getNews = async (req, res) => {
  const { category } = req.params;
  const cacheKey = `news:${category}`;

  try {
    console.log(`🔍 Request received for category: ${category}`);

    // 1️⃣ Check if data is cached in Redis
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("✅ Returning cached news from Redis.");
      return res.json(JSON.parse(cachedData));
    }

    // 2️⃣ Fetch news from PostgreSQL
    const news = await getNewsByCategory(category);
    console.log(
      `📰 Found ${news.length} articles in DB for category: ${category}`
    );

    if (news.length === 0) {
      console.warn(`⚠️ No news found in database for category: ${category}`);
      return res
        .status(404)
        .json({ message: "No news found in this category." });
    }

    // 3️⃣ Store results in Redis for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(news));

    res.json(news);
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching news", error: error.message });
  }
};

export { fetchAndStoreNews, getNews };
