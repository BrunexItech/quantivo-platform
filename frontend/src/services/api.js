import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== CHAT API =====
export const chatAPI = {
  sendMessage: async (message, history = [], language = 'en') => {
    try {
      const response = await api.post('/chat', { message, history, language });
      return response.data.data.reply;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }
};

export default api;