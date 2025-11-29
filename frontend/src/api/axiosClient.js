// src/api/axiosClient.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, 
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err?.response || err);
    throw err;
  }
);

export default api;
