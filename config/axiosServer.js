import axios from "axios";

const baseURL = 'https://api.phaata.info/api/v1';

const axiosServer = axios.create({
  baseURL,
  headers: {
    "Content-Type": 'application/json',
    'Authorization': '8VeWL3zQhippDYym+1Vy8pU0ZJiEH4YJfY6cyxVTKh4=',
  }
})

// Add a request interceptor
axiosServer.interceptors.request.use(function (config) {
  // let token = localStorage.getItem('token')
  // config.headers.Authorization = token
  return config;
}, function (error) {
  return Promise.reject(error);
});

// Add a response interceptor
axiosServer.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

export default axiosServer;