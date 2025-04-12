import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:5141/api',
  timeout: 5000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      // Optional: redirect to login page or dispatch logout action
    }
    return Promise.reject(error);
  }
);

export default instance;