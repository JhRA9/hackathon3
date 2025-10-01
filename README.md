# IA Platform - Plataforma de Inteligencia Artificial

## Que hice

Cree una aplicacion web completa sobre inteligencia artificial usando React, TypeScript y Node.js. La pagina permite a los usuarios crear modelos de IA, analizar datos, hacer predicciones y gestionar datasets de machine learning.

## De que trata la pagina

Es una plataforma donde puedes:
- Crear y entrenar modelos de inteligencia artificial
- Subir y analizar datasets 
- Hacer predicciones con machine learning
- Ver dashboards con estadisticas en tiempo real
- Gestionar tu perfil y configuraciones

La idea es que cualquier persona pueda usar herramientas avanzadas de IA de forma sencilla, desde analisis de sentimientos hasta vision computacional.

## Donde esta todo

**Frontend** (carpeta raiz):
- `src/pages/` - Todas las paginas (inicio de sesion, panel principal, modelos, etc)
- `src/components/` - Encabezado, pie de pagina y componentes reutilizables
- `src/hooks/` - Hook de autenticacion y logica de estado
- `src/services/` - Servicios para conectar con la API
- `src/types/` - Tipos de TypeScript

**Backend** (carpeta `backend/`):
- `src/server.js` - Servidor principal Express
- `src/routes/` - Puntos finales de la API (autenticacion, modelos, datos, etc)
- `src/middleware/` - Manejo de errores y registro de actividad
- `package.json` - Dependencias del servidor

## Como ejecutar

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
cd backend
npm install
npm run dev
```

La aplicacion corre en `http://localhost:5173` y la API en `http://localhost:3001`

## Usuarios demo

- **Administrador**: admin@ia-platform.com / password
- **Usuario**: user@ia-platform.com / password

## Tecnologias usadas

- React 19 + TypeScript
- React Router para navegacion
- Bootstrap para el diseno
- Node.js + Express para el backend
- JWT para autenticacion
- bcrypt para seguridad
