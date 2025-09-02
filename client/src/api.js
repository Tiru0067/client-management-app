import axios from "axios";

const api = axios.create({
  baseURL: "https://customer-management-app-jd7s.onrender.com/api",
});

export default api;
