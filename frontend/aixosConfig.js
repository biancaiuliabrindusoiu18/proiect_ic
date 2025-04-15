import axios from 'axios';

// Configurarea axios pentru a apela backend-ul
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL-ul backend-ului tău
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
