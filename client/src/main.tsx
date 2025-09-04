import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/queryClient';
import App from './App.tsx';
import './index.css';

// Handle unhandled promise rejections (often from browser extensions)
window.addEventListener('unhandledrejection', (event) => {
  // Suppress extension-related errors
  if (event.reason?.message?.includes('message channel closed') ||
      event.reason?.message?.includes('listener indicated an asynchronous response')) {
    event.preventDefault();
    console.debug('Suppressed extension-related error:', event.reason);
    return;
  }
  
  // Log other unhandled rejections for debugging
  console.error('Unhandled promise rejection:', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
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