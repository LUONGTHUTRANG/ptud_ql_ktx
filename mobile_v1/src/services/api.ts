import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Change this to your computer's IP address if running on a physical device
// For Android Emulator, use 'http://10.0.2.2:5000/api'
// For iOS Simulator, use 'http://localhost:5000/api'
// Your current LAN IP seems to be 192.168.1.67
const API_URL = "http://10.13.46.56:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
