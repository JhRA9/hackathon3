import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RegisterData } from '../types';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Por favor, ingresa un email válido');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const success = await register(formData);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Error al registrar la cuenta. Inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <i className="bi bi-person-plus-fill text-primary" style={{ fontSize: '3rem' }}></i>
                <h2 className="fw-bold mt-3">Crear Cuenta</h2>
                <p className="text-muted">Únete a IA Platform</p>
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
                    <i className="bi bi-person me-2"></i>
                    Nombre Completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    size="lg"
                    required
                    disabled={isLoading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-envelope me-2"></i>
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    size="lg"
                    required
                    disabled={isLoading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-lock me-2"></i>
                    Contraseña
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
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

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-lock-fill me-2"></i>
                    Confirmar Contraseña
                  </Form.Label>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    size="lg"
                    required
                    disabled={isLoading}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id="terms"
                    label={
                      <>
                        Acepto los{' '}
                        <Link to="/terms" className="text-decoration-none">
                          términos y condiciones
                        </Link>{' '}
                        y la{' '}
                        <Link to="/privacy" className="text-decoration-none">
                          política de privacidad
                        </Link>
                      </>
                    }
                    required
                    disabled={isLoading}
                  />
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
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Crear Cuenta
                    </>
                  )}
                </Button>
              </Form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login" className="fw-semibold text-decoration-none">
                    Inicia sesión aquí
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

export default RegisterPage;