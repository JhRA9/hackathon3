import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';
import * as authService from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la aplicación
    const initializeAuth = async () => {
      try {
        const token = authService.getStoredToken();
        if (token) {
          const user = await authService.validateToken(token);
          if (user) {
            setAuthState({
              user,
              token,
              isLoading: false,
              isAuthenticated: true,
            });
            return;
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.removeStoredToken();
      }
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
      }));
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        authService.storeToken(token);
        
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
        
        return true;
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.register(data);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        authService.storeToken(token);
        
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
        
        return true;
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error) {
      console.error('Register error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    authService.removeStoredToken();
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const updateUser = (user: User) => {
    setAuthState(prev => ({
      ...prev,
      user,
    }));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};