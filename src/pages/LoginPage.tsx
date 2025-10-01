import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials } from '../types';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!credentials.email || !credentials.password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (!credentials.email.includes('@')) {
      setError('Por favor, ingresa un email válido');
      return;
    }

    try {
      const success = await login(credentials);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.');
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'user') => {
    const demoCredentials: LoginCredentials = {
      email: role === 'admin' ? 'admin@ia-platform.com' : 'user@ia-platform.com',
      password: 'password',
    };
    
    try {
      const success = await login(demoCredentials);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Error al iniciar sesión demo');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <i className="bi bi-cpu-fill text-primary" style={{ fontSize: '3rem' }}></i>
                <h2 className="fw-bold mt-3">Iniciar Sesión</h2>
                <p className="text-muted">Accede a tu cuenta de IA Platform</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-envelope me-2"></i>
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    size="lg"
                    required
                    disabled={isLoading}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-lock me-2"></i>
                    Contraseña
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="Tu contraseña"
                      size="lg"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y border-0"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </Button>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center mb-4">
                <Link to="/forgot-password" className="text-decoration-none">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <hr className="my-4" />

              <div className="text-center mb-3">
                <small className="text-muted">Cuentas demo para pruebas:</small>
              </div>

              <div className="d-grid gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isLoading}
                >
                  <i className="bi bi-person-gear me-2"></i>
                  Demo Administrador
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => handleDemoLogin('user')}
                  disabled={isLoading}
                >
                  <i className="bi bi-person me-2"></i>
                  Demo Usuario
                </Button>
              </div>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">
                  ¿No tienes una cuenta?{' '}
                  <Link to="/register" className="fw-semibold text-decoration-none">
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;