// Middleware para manejo centralizado de errores
export const errorHandler = (err, req, res, next) => {
  console.error('Error capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: Object.values(err.errors).map(e => e.message),
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido',
      message: 'El token de autenticación no es válido',
    });
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expirado',
      message: 'El token de autenticación ha expirado',
    });
  }

  // Error de duplicado (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: 'Recurso duplicado',
      message: `El ${field} ya está en uso`,
    });
  }

  // Error de cast (MongoDB)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'El formato del ID proporcionado no es válido',
    });
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'JSON inválido',
      message: 'El formato JSON de la petición no es válido',
    });
  }

  // Error por defecto
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Error interno del servidor' : message,
    message: statusCode === 500 ? 'Algo salió mal en el servidor' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Middleware para capturar errores asíncronos
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Clase para errores personalizados
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Errores comunes predefinidos
export const createError = {
  badRequest: (message = 'Petición inválida') => new AppError(message, 400),
  unauthorized: (message = 'No autorizado') => new AppError(message, 401),
  forbidden: (message = 'Acceso prohibido') => new AppError(message, 403),
  notFound: (message = 'Recurso no encontrado') => new AppError(message, 404),
  conflict: (message = 'Conflicto con el recurso') => new AppError(message, 409),
  tooManyRequests: (message = 'Demasiadas peticiones') => new AppError(message, 429),
  internal: (message = 'Error interno del servidor') => new AppError(message, 500),
};