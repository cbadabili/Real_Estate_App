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
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry authentication errors
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        return failureCount < 1;
      },
      retryDelay: 1000,
    },
  },
});

// API request helper for mutations (POST, PUT, DELETE)
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const fullUrl = `${baseUrl}${url}`;

  // Get token from localStorage if not provided in headers
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add Authorization header if token exists and not already present
  if (token && !headers['Authorization'] && !headers['authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('Adding auth header with token:', token.substring(0, 20) + '...');
  }

  const config: RequestInit = {
    ...options,
    headers,
    url: fullUrl, // Include the full URL in the config
  };

  console.log('API Request:', config.method || 'GET', fullUrl);

  let response: Response;
  try {
    response = await fetch(fullUrl, config);
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
        url: fullUrl,
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