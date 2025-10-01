import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [preferencesData, setPreferencesData] = useState({
    theme: 'light',
    language: 'es',
    notifications: true,
    emailUpdates: true,
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user) {
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email,
      };
      
      updateUser(updatedUser);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Preferencias guardadas correctamente' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }
    
    if (securityData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }
    
    setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold mb-2">Configuración</h1>
          <p className="text-muted mb-0">Gestiona tu cuenta y preferencias</p>
        </Col>
      </Row>

      {message && (
        <Row className="mb-4">
          <Col>
            <Alert variant={message.type === 'success' ? 'success' : 'danger'}>
              <i className={`bi bi-${message.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
              {message.text}
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(tab) => setActiveTab(tab || 'profile')}
                className="mb-4"
              >
                <Tab eventKey="profile" title={<><i className="bi bi-person-gear me-2"></i>Perfil</>}>
                  <Form onSubmit={handleProfileSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Nombre Completo</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Rol</Form.Label>
                          <Form.Control
                            type="text"
                            value={user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                            disabled
                          />
                          <Form.Text className="text-muted">
                            El rol no puede ser modificado por el usuario
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Fecha de Registro</Form.Label>
                          <Form.Control
                            type="text"
                            value={user?.createdAt.toLocaleDateString()}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button type="submit" variant="primary">
                      <i className="bi bi-check-lg me-2"></i>
                      Guardar Cambios
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="preferences" title={<><i className="bi bi-gear me-2"></i>Preferencias</>}>
                  <Form onSubmit={handlePreferencesSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Tema</Form.Label>
                          <Form.Select
                            value={preferencesData.theme}
                            onChange={(e) => setPreferencesData(prev => ({ ...prev, theme: e.target.value }))}
                          >
                            <option value="light">Claro</option>
                            <option value="dark">Oscuro</option>
                            <option value="auto">Automático</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Idioma</Form.Label>
                          <Form.Select
                            value={preferencesData.language}
                            onChange={(e) => setPreferencesData(prev => ({ ...prev, language: e.target.value }))}
                          >
                            <option value="es">Español</option>
                            <option value="en">English</option>
                            <option value="pt">Português</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <h6 className="fw-semibold mb-3">Notificaciones</h6>
                        <Form.Check
                          type="checkbox"
                          id="notifications"
                          label="Recibir notificaciones en la aplicación"
                          checked={preferencesData.notifications}
                          onChange={(e) => setPreferencesData(prev => ({ ...prev, notifications: e.target.checked }))}
                          className="mb-2"
                        />
                        <Form.Check
                          type="checkbox"
                          id="emailUpdates"
                          label="Recibir actualizaciones por email"
                          checked={preferencesData.emailUpdates}
                          onChange={(e) => setPreferencesData(prev => ({ ...prev, emailUpdates: e.target.checked }))}
                          className="mb-3"
                        />
                      </Col>
                    </Row>

                    <Button type="submit" variant="primary">
                      <i className="bi bi-check-lg me-2"></i>
                      Guardar Preferencias
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="security" title={<><i className="bi bi-shield-lock me-2"></i>Seguridad</>}>
                  <Form onSubmit={handleSecuritySubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Contraseña Actual</Form.Label>
                          <Form.Control
                            type="password"
                            value={securityData.currentPassword}
                            onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            placeholder="Ingresa tu contraseña actual"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Nueva Contraseña</Form.Label>
                          <Form.Control
                            type="password"
                            value={securityData.newPassword}
                            onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Mínimo 6 caracteres"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Confirmar Nueva Contraseña</Form.Label>
                          <Form.Control
                            type="password"
                            value={securityData.confirmPassword}
                            onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Repite la nueva contraseña"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="mb-4">
                      <h6 className="fw-semibold mb-2">Consejos de Seguridad</h6>
                      <ul className="text-muted small">
                        <li>Use al menos 8 caracteres</li>
                        <li>Combine letras mayúsculas y minúsculas</li>
                        <li>Incluya números y símbolos</li>
                        <li>Evite información personal</li>
                      </ul>
                    </div>

                    <Button type="submit" variant="warning">
                      <i className="bi bi-key me-2"></i>
                      Cambiar Contraseña
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="danger" title={<><i className="bi bi-exclamation-triangle me-2"></i>Zona Peligrosa</>}>
                  <div className="border border-danger rounded p-4">
                    <h5 className="text-danger fw-bold mb-3">Acciones Irreversibles</h5>
                    
                    <div className="mb-4">
                      <h6 className="fw-semibold">Eliminar Cuenta</h6>
                      <p className="text-muted mb-3">
                        Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten certeza.
                      </p>
                      <Button variant="outline-danger">
                        <i className="bi bi-trash me-2"></i>
                        Eliminar mi cuenta
                      </Button>
                    </div>
                    
                    <div>
                      <h6 className="fw-semibold">Exportar Datos</h6>
                      <p className="text-muted mb-3">
                        Descarga una copia de todos tus datos antes de eliminar tu cuenta.
                      </p>
                      <Button variant="outline-info">
                        <i className="bi bi-download me-2"></i>
                        Exportar mis datos
                      </Button>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsPage;