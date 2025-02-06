import axios from "axios";

const API_URL = "http://localhost:5000/api/news";

export const fetchNewsByCategory = async (category: string) => {
  try {
    console.log(`Fetching: ${API_URL}/${category}`);
    const response = await axios.get(`${API_URL}/${category}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
