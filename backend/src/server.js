import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/auth.js';
import modelsRoutes from './routes/models.js';
import dataRoutes from './routes/data.js';
import analysisRoutes from './routes/analysis.js';
import predictionsRoutes from './routes/predictions.js';

// Importar middleware
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana por IP
  message: {
    error: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de seguridad
app.use(helmet());
app.use(compression());
app.use(limiter);

// Configuración de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware de parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware de logging
app.use(logger);

// Rutas de salud del servidor
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// Rutas principales de la API
app.use('/api/auth', authRoutes);
app.use('/api/models', modelsRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/predictions', predictionsRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'IA Platform API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      models: '/api/models',
      data: '/api/data',
      analysis: '/api/analysis',
      predictions: '/api/predictions',
    },
    documentation: 'https://api-docs.ia-platform.com',
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.originalUrl} no existe en este servidor`,
    availableEndpoints: [
      '/health',
      '/api/auth',
      '/api/models',
      '/api/data',
      '/api/analysis',
      '/api/predictions',
    ],
  });
});

// Manejo de cierre graceful del servidor
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor HTTP...');
  server.close(() => {
    console.log('Servidor HTTP cerrado.');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor HTTP...');
  server.close(() => {
    console.log('Servidor HTTP cerrado.');
    process.exit(0);
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor IA Platform ejecutándose en puerto ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`📖 Documentación API: http://localhost:${PORT}/`);
  console.log(`❤️  Estado del servidor: http://localhost:${PORT}/health`);
});

export default app;