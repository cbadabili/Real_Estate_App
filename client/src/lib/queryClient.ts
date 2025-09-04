import { QueryClient } from '@tanstack/react-query';

// Default fetcher function for GET requests
const defaultQueryFn = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  const url = queryKey[0] as string;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Create query client with default settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

// API request helper for mutations (POST, PUT, DELETE)
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // Handle authentication errors
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return;
    }

    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};