import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, AuthAction, User, LoginCredentials, SignupCredentials, PhoneVerification } from '../types/auth';

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// Key for storing auth state in AsyncStorage
const AUTH_STORAGE_KEY = 'auth_state';

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
  verifyPhone: (data: PhoneVerification) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // Load saved auth state on app start
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const savedAuthState = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuthState) {
          const parsedState = JSON.parse(savedAuthState);
          setUser(parsedState.user);
        }
      } catch (err) {
        console.error('Failed to load auth state:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Save auth state whenever it changes, but only after initial mount
  useEffect(() => {
    // Skip the first render to avoid saving during initial load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const saveAuthState = async () => {
      try {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }));
      } catch (err) {
        console.error('Failed to save auth state:', err);
      }
    };

    saveAuthState();
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement actual login logic
      // For now, just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userData = {
        id: '1',
        name: 'John Doe',
        email,
        phone: '+1234567890',
        savedAddresses: [],
      };
      setUser(userData);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData: Omit<User, 'id'> & { password: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement actual signup logic
      // For now, just simulate a successful signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser = {
        id: '1',
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        savedAddresses: [],
      };
      setUser(newUser);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      router.replace('/login');
    } catch (err) {
      console.error('Failed to clear auth state:', err);
    }
  }, []);

  const verifyPhone = async (data: PhoneVerification) => {
    try {
      setIsLoading(true);
      // TODO: Implement actual phone verification logic
      // For now, we'll just simulate success
      setError(null);
    } catch (error) {
      setError('Phone verification failed');
    }
  };

  const resetPassword = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement actual password reset logic
      // For now, just simulate a successful password reset request
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.replace('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during password reset');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        signup,
        logout,
        verifyPhone,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext; 