import { useState, useEffect } from 'react';
import { tokenManager, UserData } from '../utils/tokenManager';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [token, userData] = await Promise.all([
        tokenManager.getToken(),
        tokenManager.getUserData(),
      ]);

      setAuthState({
        isAuthenticated: !!token,
        user: userData,
        token,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      });
    }
  };

  const login = async (token: string, userData: UserData) => {
    try {
      await tokenManager.saveAuthData(token, userData.email, userData);
      setAuthState({
        isAuthenticated: true,
        user: userData,
        token,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await tokenManager.clearAuthData();
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const refreshAuthState = () => {
    checkAuthStatus();
  };

  return {
    ...authState,
    login,
    logout,
    refreshAuthState,
  };
};
