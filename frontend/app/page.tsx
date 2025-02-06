"use client";

import { useEffect, useState } from "react";
import { fetchNewsByCategory } from "@/utils/api";

const categories = ["technology", "sports", "business", "science"];

interface NewsArticle {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  url: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("technology");

  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchNewsByCategory(selectedCategory);
      setNews(data);
    };
    loadNews();
  }, [selectedCategory]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center">News Aggregator</h1>

      {/* Category Filters */}
      <div className="flex justify-center gap-4 mt-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`btn btn-outline ${
              selectedCategory === category ? "btn-primary" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* News Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {news.length === 0 ? (
          <p className="text-center col-span-3 text-gray-500">
            No news available.
          </p>
        ) : (
          news.map((article: NewsArticle) => (
            <div key={article.id} className="card bg-base-100 shadow-lg">
              <figure>
                <img
                  src={article.image || "https://via.placeholder.com/300"}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{article.title}</h2>
                <p>{article.description || "No description available."}</p>
                <div className="card-actions justify-end">
                  <a
                    href={article.url}
                    target="_blank"
                    className="btn btn-sm btn-primary"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
