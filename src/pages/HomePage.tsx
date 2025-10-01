import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: 'bi-robot',
      title: 'Modelos de IA Avanzados',
      description: 'Crea y entrena modelos de machine learning para clasificación, regresión y análisis predictivo.',
      color: 'primary'
    },
    {
      icon: 'bi-graph-up',
      title: 'Análisis Predictivo',
      description: 'Realiza predicciones precisas basadas en datos históricos y algoritmos de aprendizaje automático.',
      color: 'success'
    },
    {
      icon: 'bi-bar-chart',
      title: 'Visualización de Datos',
      description: 'Genera gráficos interactivos y dashboards para analizar patrones y tendencias en tus datos.',
      color: 'info'
    },
    {
      icon: 'bi-cpu',
      title: 'Procesamiento en Tiempo Real',
      description: 'Procesa grandes volúmenes de datos en tiempo real con tecnología de alta performance.',
      color: 'warning'
    },
    {
      icon: 'bi-shield-check',
      title: 'Seguridad Avanzada',
      description: 'Protege tus datos con cifrado de extremo a extremo y autenticación multifactor.',
      color: 'danger'
    },
    {
      icon: 'bi-cloud-upload',
      title: 'Cloud Computing',
      description: 'Despliega tus modelos en la nube con escalabilidad automática y alta disponibilidad.',
      color: 'secondary'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Modelos Entrenados' },
    { number: '95%', label: 'Precisión Promedio' },
    { number: '50+', label: 'Algoritmos Disponibles' },
    { number: '24/7', label: 'Soporte Técnico' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Plataforma de Inteligencia Artificial
                <Badge bg="light" text="dark" className="ms-3">Beta</Badge>
              </h1>
              <p className="lead mb-4">
                Transforma tus datos en insights accionables con nuestros algoritmos de IA de última generación. 
                Desde análisis predictivo hasta procesamiento de lenguaje natural.
              </p>
              <div className="d-flex gap-3">
                {isAuthenticated ? (
                  <Button onClick={() => navigate('/dashboard')} variant="light" size="lg">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Ir al Dashboard
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => navigate('/register')} variant="light" size="lg">
                      <i className="bi bi-person-plus me-2"></i>
                      Comenzar Gratis
                    </Button>
                    <Button onClick={() => navigate('/login')} variant="outline-light" size="lg">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Iniciar Sesión
                    </Button>
                  </>
                )}
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="position-relative">
                <i className="bi bi-cpu-fill" style={{ fontSize: '15rem', opacity: 0.1 }}></i>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <i className="bi bi-robot" style={{ fontSize: '8rem' }}></i>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center">
            {stats.map((stat, index) => (
              <Col key={index} md={3} className="mb-4">
                <div className="h2 fw-bold text-primary">{stat.number}</div>
                <p className="text-muted">{stat.label}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Características Principales</h2>
              <p className="lead text-muted">
                Potencia tu negocio con herramientas de IA diseñadas para maximizar el rendimiento
              </p>
            </Col>
          </Row>
          <Row>
            {features.map((feature, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className={`text-${feature.color} mb-3`}>
                      <i className={`${feature.icon} display-4`}></i>
                    </div>
                    <h5 className="fw-bold mb-3">{feature.title}</h5>
                    <p className="text-muted">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="display-5 fw-bold mb-4">¿Listo para comenzar?</h2>
              <p className="lead mb-4">
                Únete a miles de empresas que ya están utilizando nuestra plataforma 
                para revolucionar sus procesos de negocio con inteligencia artificial.
              </p>
              {!isAuthenticated && (
                <div className="d-flex justify-content-center gap-3">
                  <Button onClick={() => navigate('/register')} variant="primary" size="lg">
                    Crear Cuenta Gratuita
                  </Button>
                  <Button onClick={() => navigate('/contact')} variant="outline-primary" size="lg">
                    Contactar Ventas
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;