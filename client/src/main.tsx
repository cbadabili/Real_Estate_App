import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/queryClient';
import App from './App';
import './index.css';

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  // Skip WebSocket-related errors that aren't critical
  if (event.reason?.message?.includes('WebSocket') || 
      event.reason?.message?.includes('wss://')) {
    event.preventDefault();
    return;
  }
  console.error('Unhandled promise rejection:', event.reason);
});

// Handle general errors from browser extensions
window.addEventListener('error', (event) => {
  const errorMessage = event.message || '';
  if (errorMessage.includes('listener indicated an asynchronous response') ||
      errorMessage.includes('message channel closed') ||
      errorMessage.includes('Extension context invalidated') ||
      errorMessage.includes('script-src') ||
      errorMessage.includes('worker-src')) {
    event.preventDefault();
    return;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);