import axios from 'axios';
import bcrypt from 'bcryptjs';
import { User, LoginCredentials, RegisterData, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para agregar token a las requests
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funciones de almacenamiento local
export const storeToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const removeStoredToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Usuarios simulados para desarrollo (se eliminará cuando conectemos con backend real)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@ia-platform.com',
    name: 'Administrador',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
  },
  {
    id: '2',
    email: 'user@ia-platform.com',
    name: 'Usuario Demo',
    role: 'user',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
  },
];

// Función para generar token JWT simulado
const generateMockToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 horas
  };
  
  // En producción usaremos una librería JWT real
  return btoa(JSON.stringify(payload));
};

// Función para validar token simulado
export const validateToken = async (token: string): Promise<User | null> => {
  try {
    // En desarrollo, validamos el token localmente
    if (process.env.NODE_ENV === 'development') {
      const payload = JSON.parse(atob(token));
      const user = mockUsers.find(u => u.id === payload.id);
      return user || null;
    }
    
    // En producción, validamos con el backend
    const response = await api.get<ApiResponse<User>>('/auth/validate');
    return response.data.data || null;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

// Función de login
export const login = async (credentials: LoginCredentials): Promise<ApiResponse<{user: User, token: string}>> => {
  try {
    // En desarrollo, usamos autenticación simulada
    if (process.env.NODE_ENV === 'development') {
      // Simulamos delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado',
        };
      }
      
      // Para demo, acepta cualquier contraseña o la contraseña "password"
      const isValidPassword = credentials.password === 'password' || 
                             await bcrypt.compare(credentials.password, '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
      
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Credenciales inválidas',
        };
      }
      
      const token = generateMockToken(user);
      
      return {
        success: true,
        data: { user, token },
      };
    }
    
    // En producción, usamos el backend real
    const response = await api.post<ApiResponse<{user: User, token: string}>>('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    console.error('Login service error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error de conexión',
    };
  }
};

// Función de registro
export const register = async (data: RegisterData): Promise<ApiResponse<{user: User, token: string}>> => {
  try {
    // Validaciones básicas
    if (data.password !== data.confirmPassword) {
      return {
        success: false,
        error: 'Las contraseñas no coinciden',
      };
    }
    
    if (data.password.length < 6) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres',
      };
    }
    
    // En desarrollo, usamos registro simulado
    if (process.env.NODE_ENV === 'development') {
      // Simulamos delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar si el email ya existe
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        return {
          success: false,
          error: 'El email ya está registrado',
        };
      }
      
      // Crear nuevo usuario
      const newUser: User = {
        id: String(mockUsers.length + 1),
        email: data.email,
        name: data.name,
        role: 'user',
        createdAt: new Date(),
        lastLogin: new Date(),
      };
      
      mockUsers.push(newUser);
      const token = generateMockToken(newUser);
      
      return {
        success: true,
        data: { user: newUser, token },
      };
    }
    
    // En producción, usamos el backend real
    const response = await api.post<ApiResponse<{user: User, token: string}>>('/auth/register', data);
    return response.data;
  } catch (error: any) {
    console.error('Register service error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error de conexión',
    };
  }
};

// Función para obtener el perfil del usuario
export const getProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  } catch (error: any) {
    console.error('Get profile error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error de conexión',
    };
  }
};

// Función para actualizar el perfil
export const updateProfile = async (userData: Partial<User>): Promise<ApiResponse<User>> => {
  try {
    const response = await api.put<ApiResponse<User>>('/auth/profile', userData);
    return response.data;
  } catch (error: any) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error de conexión',
    };
  }
};

export default api;