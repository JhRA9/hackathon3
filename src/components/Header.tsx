import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <i className="bi bi-cpu-fill me-2"></i>
          IA Platform
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <i className="bi bi-house me-1"></i>
              Inicio
            </Nav.Link>
            
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  <i className="bi bi-speedometer2 me-1"></i>
                  Dashboard
                </Nav.Link>
                
                <NavDropdown 
                  title={
                    <>
                      <i className="bi bi-robot me-1"></i>
                      Modelos IA
                    </>
                  } 
                  id="models-dropdown"
                >
                  <NavDropdown.Item onClick={() => handleNavClick('/models')}>
                    <i className="bi bi-diagram-3 me-2"></i>
                    Ver Modelos
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavClick('/models/create')}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Crear Modelo
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => handleNavClick('/predictions')}>
                    <i className="bi bi-graph-up me-2"></i>
                    Predicciones
                  </NavDropdown.Item>
                </NavDropdown>
                
                <Nav.Link as={Link} to="/analysis">
                  <i className="bi bi-bar-chart me-1"></i>
                  Análisis
                </Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <>
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.name}
                    {user?.role === 'admin' && (
                      <Badge bg="primary" className="ms-1">Admin</Badge>
                    )}
                  </>
                } 
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={() => handleNavClick('/profile')}>
                  <i className="bi bi-person-gear me-2"></i>
                  Perfil
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavClick('/settings')}>
                  <i className="bi bi-gear me-2"></i>
                  Configuración
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button variant="outline-light" className="me-2" onClick={() => handleNavClick('/login')}>
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Iniciar Sesión
                </Button>
                <Button variant="primary" onClick={() => handleNavClick('/register')}>
                  <i className="bi bi-person-plus me-1"></i>
                  Registrarse
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;