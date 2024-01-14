import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://192.168.1.10:8000",
  timeout: 5000,
  headers: {
    'Accept': 'application/json',
  }
});