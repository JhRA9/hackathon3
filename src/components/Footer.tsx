import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h5 className="fw-bold">
              <i className="bi bi-cpu-fill me-2"></i>
              IA Platform
            </h5>
            <p className="text-muted">
              Plataforma avanzada de inteligencia artificial para análisis de datos, 
              creación de modelos predictivos y automatización inteligente.
            </p>
          </Col>
          
          <Col md={2}>
            <h6 className="fw-bold">Productos</h6>
            <ul className="list-unstyled">
              <li><a href="/models" className="text-muted text-decoration-none">Modelos IA</a></li>
              <li><a href="/analysis" className="text-muted text-decoration-none">Análisis</a></li>
              <li><a href="/predictions" className="text-muted text-decoration-none">Predicciones</a></li>
              <li><a href="/dashboard" className="text-muted text-decoration-none">Dashboard</a></li>
            </ul>
          </Col>
          
          <Col md={2}>
            <h6 className="fw-bold">Recursos</h6>
            <ul className="list-unstyled">
              <li><a href="/docs" className="text-muted text-decoration-none">Documentación</a></li>
              <li><a href="/api" className="text-muted text-decoration-none">API</a></li>
              <li><a href="/tutorials" className="text-muted text-decoration-none">Tutoriales</a></li>
              <li><a href="/support" className="text-muted text-decoration-none">Soporte</a></li>
            </ul>
          </Col>
          
          <Col md={2}>
            <h6 className="fw-bold">Empresa</h6>
            <ul className="list-unstyled">
              <li><a href="/about" className="text-muted text-decoration-none">Acerca de</a></li>
              <li><a href="/contact" className="text-muted text-decoration-none">Contacto</a></li>
              <li><a href="/careers" className="text-muted text-decoration-none">Carreras</a></li>
              <li><a href="/privacy" className="text-muted text-decoration-none">Privacidad</a></li>
            </ul>
          </Col>
          
          <Col md={2}>
            <h6 className="fw-bold">Síguenos</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="bi bi-github fs-5"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="bi bi-youtube fs-5"></i>
              </a>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-muted mb-0">
              © {currentYear} IA Platform. Todos los derechos reservados.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <small className="text-muted">
              Construido con React, TypeScript y Bootstrap | 
              <a href="/terms" className="text-muted text-decoration-none ms-2">Términos de Servicio</a>
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;