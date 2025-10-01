// Middleware de logging para requests HTTP
export const logger = (req, res, next) => {
  const startTime = Date.now();
  
  // Capturar el método original de res.json para loggear responses
  const originalJson = res.json;
  res.json = function(obj) {
    const duration = Date.now() - startTime;
    
    // Log de la respuesta
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    
    // Si hay error, loggear detalles adicionales
    if (res.statusCode >= 400) {
      console.error(`Error details:`, {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        body: req.body,
        query: req.query,
        params: req.params,
      });
    }
    
    return originalJson.call(this, obj);
  };
  
  // Log de la petición entrante
  console.log(`${new Date().toISOString()} - Incoming ${req.method} ${req.url}`);
  
  next();
};

// Logger para desarrollo con más detalles
export const devLogger = (req, res, next) => {
  const startTime = Date.now();
  
  console.log('\n--- Request Details ---');
  console.log(`🌐 ${req.method} ${req.url}`);
  console.log(`🕐 ${new Date().toISOString()}`);
  console.log(`📍 IP: ${req.ip}`);
  console.log(`🔧 User-Agent: ${req.get('User-Agent')}`);
  
  if (Object.keys(req.query).length > 0) {
    console.log(`🔍 Query:`, req.query);
  }
  
  if (Object.keys(req.params).length > 0) {
    console.log(`📋 Params:`, req.params);
  }
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, req.body);
  }
  
  // Capturar respuesta
  const originalJson = res.json;
  res.json = function(obj) {
    const duration = Date.now() - startTime;
    
    console.log(`--- Response Details ---`);
    console.log(`⚡ Status: ${res.statusCode}`);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`📤 Response:`, obj);
    console.log('------------------------\n');
    
    return originalJson.call(this, obj);
  };
  
  next();
};

// Logger específico para errores
export const errorLogger = (err, req, res, next) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    body: req.body,
    query: req.query,
    params: req.params,
  };
  
  console.error('🚨 ERROR CAPTURED:', JSON.stringify(errorInfo, null, 2));
  
  next(err);
};

// Logger para accesos exitosos
export const accessLogger = (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode < 400) {
      console.log(`✅ ${req.method} ${req.url} - ${res.statusCode}`);
    }
  });
  
  next();
};