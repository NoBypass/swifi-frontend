import axios from 'axios';

const httpClient = axios.create({
  baseURL: typeof window !== 'undefined' ? '/api' : `${import.meta.env.SERVICE_URL || 'http://localhost:4321'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.data && error.response.data.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);


export default httpClient;
