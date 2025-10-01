import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

const router = express.Router();

// Base de datos simulada (en producción usar MongoDB/PostgreSQL)
const users = [
  {
    id: '1',
    email: 'admin@ia-platform.com',
    name: 'Administrador',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    lastLogin: null,
  },
  {
    id: '2',
    email: 'user@ia-platform.com',
    name: 'Usuario Demo',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'user',
    createdAt: new Date('2024-01-15'),
    lastLogin: null,
  },
];

// Generar JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'ia-platform-secret-key-2024',
    { expiresIn: '24h' }
  );
};

// Middleware de autenticación
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token de acceso requerido',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'ia-platform-secret-key-2024', (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Token inválido',
      });
    }

    // Buscar usuario
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    req.user = user;
    next();
  });
};

// POST /api/auth/login - Iniciar sesión
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Email válido requerido'),
  body('password').isLength({ min: 1 }).withMessage('Contraseña requerida'),
], asyncHandler(async (req, res) => {
  // Validar errores de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError.badRequest('Datos de entrada inválidos');
  }

  const { email, password } = req.body;

  // Buscar usuario
  const user = users.find(u => u.email === email);
  if (!user) {
    throw createError.unauthorized('Credenciales inválidas');
  }

  // Verificar contraseña
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw createError.unauthorized('Credenciales inválidas');
  }

  // Actualizar último login
  user.lastLogin = new Date();

  // Generar token
  const token = generateToken(user.id);

  // Respuesta exitosa (sin incluir la contraseña)
  const userResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };

  res.json({
    success: true,
    message: 'Login exitoso',
    data: {
      user: userResponse,
      token,
    },
  });
}));

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', [
  body('name').isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email válido requerido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
], asyncHandler(async (req, res) => {
  // Validar errores de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Datos de entrada inválidos',
      details: errors.array(),
    });
  }

  const { name, email, password } = req.body;

  // Verificar si el email ya existe
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw createError.conflict('El email ya está registrado');
  }

  // Encriptar contraseña
  const hashedPassword = await bcrypt.hash(password, 12);

  // Crear nuevo usuario
  const newUser = {
    id: String(users.length + 1),
    email,
    name,
    password: hashedPassword,
    role: 'user',
    createdAt: new Date(),
    lastLogin: new Date(),
  };

  // Guardar usuario
  users.push(newUser);

  // Generar token
  const token = generateToken(newUser.id);

  // Respuesta exitosa (sin incluir la contraseña)
  const userResponse = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    createdAt: newUser.createdAt,
    lastLogin: newUser.lastLogin,
  };

  res.status(201).json({
    success: true,
    message: 'Usuario registrado exitosamente',
    data: {
      user: userResponse,
      token,
    },
  });
}));

// GET /api/auth/profile - Obtener perfil del usuario
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const userResponse = {
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    createdAt: req.user.createdAt,
    lastLogin: req.user.lastLogin,
  };

  res.json({
    success: true,
    data: userResponse,
  });
}));

// PUT /api/auth/profile - Actualizar perfil
router.put('/profile', authenticateToken, [
  body('name').optional().isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Email válido requerido'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Datos de entrada inválidos',
      details: errors.array(),
    });
  }

  const { name, email } = req.body;
  const user = req.user;

  // Verificar si el nuevo email ya está en uso
  if (email && email !== user.email) {
    const existingUser = users.find(u => u.email === email && u.id !== user.id);
    if (existingUser) {
      throw createError.conflict('El email ya está en uso');
    }
    user.email = email;
  }

  // Actualizar campos
  if (name) user.name = name;

  const userResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };

  res.json({
    success: true,
    message: 'Perfil actualizado exitosamente',
    data: userResponse,
  });
}));

// POST /api/auth/validate - Validar token
router.get('/validate', authenticateToken, asyncHandler(async (req, res) => {
  const userResponse = {
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    createdAt: req.user.createdAt,
    lastLogin: req.user.lastLogin,
  };

  res.json({
    success: true,
    message: 'Token válido',
    data: userResponse,
  });
}));

// POST /api/auth/logout - Cerrar sesión (invalidar token)
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  // En una implementación real, aquí se invalidaría el token
  // Por simplicidad, solo retornamos success
  res.json({
    success: true,
    message: 'Sesión cerrada exitosamente',
  });
}));

export default router;