import axios from 'axios';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');
const routeMode = import.meta.env.VITE_API_ROUTE_MODE || 'gateway';

const httpClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 120000,
});

export function getEndpoint(type) {
  return routeMode === 'direct' ? `/api/process/${type}` : `/api/process?type=${type}`;
}

export async function processDocument({ file, type, onUploadProgress }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await httpClient.post(getEndpoint(type), formData, {
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