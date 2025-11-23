import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1", // Trỏ về API Gateway
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động gắn Token vào mỗi request nếu đã đăng nhập
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
