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
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
  };

  console.log('API Request:', url, config.method || 'GET');

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    console.error('Network error:', error);
    throw new Error('Network error. Please check your connection.');
  }

  console.log('API Response status:', response.status);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        method: config.method || 'GET',
        errorData
      });
    } catch (parseError) {
      console.error('Error parsing error response:', parseError);
      console.error('Raw response status:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.error('API Error:', errorData);
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  try {
    const data = await response.json();
    console.log('API Response data received');
    return data;
  } catch (parseError) {
    console.error('Error parsing response:', parseError);
    throw new Error('Invalid response format');
  }
};