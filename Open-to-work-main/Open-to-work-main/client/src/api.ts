import axios from "axios";
import { API_URL } from "@/config";

const API = axios.create({
  baseURL: `${API_URL}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;