import axios from 'axios';

// Debugging: Verifica qué URL está usando
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
console.log('🔗 API URL configurada:', apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Si el token expiró o es inválido, el backend responde 401.
// En ese caso limpiamos la sesión y mandamos al usuario a login
// en vez de dejar la pantalla colgada con errores silenciosos.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
