export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Tipos relacionados con IA
export interface AIModel {
  id: string;
  name: string;
  description: string;
  type: 'classification' | 'regression' | 'clustering' | 'nlp' | 'computer-vision';
  accuracy?: number;
  status: 'training' | 'ready' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface DataSet {
  id: string;
  name: string;
  description: string;
  size: number;
  format: 'csv' | 'json' | 'excel' | 'txt';
  columns: string[];
  uploadedAt: Date;
}

export interface Prediction {
  id: string;
  modelId: string;
  input: Record<string, any>;
  output: Record<string, any>;
  confidence: number;
  createdAt: Date;
}

export interface AnalysisResult {
  id: string;
  datasetId: string;
  type: 'descriptive' | 'diagnostic' | 'predictive' | 'prescriptive';
  results: Record<string, any>;
  charts: ChartData[];
  createdAt: Date;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  data: any[];
  labels: string[];
  title: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}