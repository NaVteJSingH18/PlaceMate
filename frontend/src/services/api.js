import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // This will be proxied by Vite to http://localhost:5000/api
});

const getTokenFromCookie = () => {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith('token='));

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
};

// Request interceptor for adding the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect handling can be done at the router/component level
    }
    return Promise.reject(error);
  }
);

export default api;
