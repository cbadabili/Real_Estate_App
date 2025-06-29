import { useState, useCallback } from 'react';

interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface AsyncOperationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useAsyncOperation = <T = any>(options: AsyncOperationOptions = {}) => {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false
  });

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));

    try {
      const result = await asyncFn();
      
      setState({
        data: result,
        loading: false,
        error: null,
        success: true
      });

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : options.errorMessage || 'An unexpected error occurred';

      setState({
        data: null,
        loading: false,
        error: errorMessage,
        success: false
      });

      if (options.onError && error instanceof Error) {
        options.onError(error);
      }

      throw error;
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    clearError
  };
};

// Specialized hook for form submissions
export const useFormSubmission = <T = any>(options: AsyncOperationOptions = {}) => {
  const asyncOp = useAsyncOperation<T>(options);

  const submit = useCallback(async (formData: any, endpoint: string, method: 'POST' | 'PUT' | 'PATCH' = 'POST') => {
    return asyncOp.execute(async () => {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return response.json();
    });
  }, [asyncOp]);

  return {
    ...asyncOp,
    submit
  };
};

// Hook for data fetching with retry capability
export const useDataFetch = <T = any>(url: string, options: AsyncOperationOptions & { 
  retryCount?: number;
  retryDelay?: number;
} = {}) => {
  const { retryCount = 2, retryDelay = 1000, ...asyncOptions } = options;
  const asyncOp = useAsyncOperation<T>(asyncOptions);

  const fetchData = useCallback(async () => {
    return asyncOp.execute(async () => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= retryCount; attempt++) {
        try {
          const response = await fetch(url);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Fetch failed' }));
            throw new Error(errorData.message || `Failed to fetch data (${response.status})`);
          }

          return response.json();
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          
          if (attempt < retryCount) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
          }
        }
      }

      throw lastError || new Error('Failed to fetch data after retries');
    });
  }, [url, retryCount, retryDelay, asyncOp]);

  return {
    ...asyncOp,
    refetch: fetchData
  };
};