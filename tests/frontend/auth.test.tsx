
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContextProvider, useAuthContext } from '../../client/src/contexts/AuthContext';

// Mock fetch
global.fetch = vi.fn();

const TestComponent = () => {
  const { user, login, logout, loading } = useAuthContext();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('Authentication Context', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with no user', () => {
    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
  });

  it('should handle successful login', async () => {
    const mockUser = { id: 1, email: 'test@example.com', role: 'user' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser, token: 'fake-token' })
    });

    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
  });

  it('should handle logout', async () => {
    const mockUser = { id: 1, email: 'test@example.com', role: 'user' };
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });
  });
});
