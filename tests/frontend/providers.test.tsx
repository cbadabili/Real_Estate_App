
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../../client/src/App';
import { AuthContextProvider } from '../../client/src/contexts/AuthContext';

// Mock components to avoid complex dependencies
vi.mock('../../client/src/pages/HomePage', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}));

vi.mock('../../client/src/pages/PropertiesPage', () => ({
  default: () => <div data-testid="properties-page">Properties Page</div>
}));

describe('Frontend Providers & Bootstrap', () => {
  const createTestApp = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </QueryClientProvider>
      </BrowserRouter>
    );
  };

  it('should render app with all providers', () => {
    render(createTestApp());
    // Should not throw and should render something
    expect(document.body).toBeInTheDocument();
  });

  it('should handle routing correctly', () => {
    // This will be expanded based on actual routing structure
    render(createTestApp());
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});
