import axios from 'axios';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

const httpClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 120000,
});

export function getEndpoint() {
  return '/api/analyze/resume';
}

export async function analyzeResume({ file, role, onUploadProgress }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('role', role);

  const response = await httpClient.post(getEndpoint(), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (event) => {
      if (onUploadProgress && event.total) {
        const percentage = Math.round((event.loaded * 100) / event.total);
        onUploadProgress(percentage);
      }
    },
  });

  return response.data;
}

export function parseApiError(error) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Request failed';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

export async function healthCheck() {
  try {
    await httpClient.get('/health');
    return true;
  } catch {
    return false;
  }
}

export async function chatMessage({ role, message }) {
  const response = await httpClient.post('/api/chat', { role, message });
  return response.data;
}