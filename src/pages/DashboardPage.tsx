import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Spinner } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalModels: number;
  activeModels: number;
  totalPredictions: number;
  successRate: number;
  dataProcessed: string;
  lastUpdate: Date;
}

interface RecentActivity {
  id: string;
  type: 'model_created' | 'prediction_made' | 'data_uploaded' | 'analysis_completed';
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error';
}

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Simulamos la carga de datos del dashboard
    const loadDashboardData = () => {
      setTimeout(() => {
        setStats({
          totalModels: 15,
          activeModels: 12,
          totalPredictions: 1847,
          successRate: 94.2,
          dataProcessed: '2.4 TB',
          lastUpdate: new Date(),
        });

        setActivities([
          {
            id: '1',
            type: 'model_created',
            description: 'Modelo de clasificación de imágenes creado exitosamente',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
            status: 'success',
          },
          {
            id: '2',
            type: 'prediction_made',
            description: '250 predicciones procesadas en análisis de sentimientos',
            timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
            status: 'success',
          },
          {
            id: '3',
            type: 'data_uploaded',
            description: 'Dataset de ventas Q4 cargado (45,000 registros)',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            status: 'success',
          },
          {
            id: '4',
            type: 'analysis_completed',
            description: 'Análisis predictivo de demanda completado',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
            status: 'warning',
          },
        ]);

        setIsLoading(false);
      }, 1500);
    };

    loadDashboardData();
  }, [isAuthenticated, navigate]);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'model_created': return 'bi-robot';
      case 'prediction_made': return 'bi-graph-up';
      case 'data_uploaded': return 'bi-cloud-upload';
      case 'analysis_completed': return 'bi-bar-chart';
      default: return 'bi-info-circle';
    }
  };

  const getActivityColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'secondary';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} d ago`;
    }
  };

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold mb-2">
                Bienvenido, {user?.name}
                {user?.role === 'admin' && (
                  <Badge bg="primary" className="ms-2">Admin</Badge>
                )}
              </h1>
              <p className="text-muted mb-0">
                Aquí tienes un resumen de tu actividad en IA Platform
              </p>
            </div>
            <Button variant="primary" onClick={() => navigate('/models/create')}>
              <i className="bi bi-plus-circle me-2"></i>
              Crear Modelo
            </Button>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-robot text-primary display-6"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="fw-bold h4 mb-0">{stats?.totalModels}</div>
                  <div className="text-muted small">Modelos Totales</div>
                  <div className="text-success small">
                    <i className="bi bi-arrow-up"></i> {stats?.activeModels} activos
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-graph-up text-success display-6"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="fw-bold h4 mb-0">{stats?.totalPredictions.toLocaleString()}</div>
                  <div className="text-muted small">Predicciones</div>
                  <div className="text-success small">
                    <i className="bi bi-arrow-up"></i> +12% este mes
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-bullseye text-warning display-6"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="fw-bold h4 mb-0">{stats?.successRate}%</div>
                  <div className="text-muted small">Precisión</div>
                  <ProgressBar 
                    now={stats?.successRate} 
                    variant="warning" 
                    style={{ height: '4px' }}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-database text-info display-6"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="fw-bold h4 mb-0">{stats?.dataProcessed}</div>
                  <div className="text-muted small">Datos Procesados</div>
                  <div className="text-info small">
                    <i className="bi bi-arrow-up"></i> +3.2 GB hoy
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-activity me-2"></i>
                Actividad Reciente
              </h5>
            </Card.Header>
            <Card.Body>
              {activities.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-inbox display-4"></i>
                  <p className="mt-2">No hay actividad reciente</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {activities.map((activity) => (
                    <div key={activity.id} className="list-group-item px-0 py-3 border-0 border-bottom">
                      <div className="d-flex align-items-start">
                        <div className="flex-shrink-0">
                          <i className={`${getActivityIcon(activity.type)} text-${getActivityColor(activity.status)}`}></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <div className="fw-semibold">{activity.description}</div>
                          <small className="text-muted">{formatTimeAgo(activity.timestamp)}</small>
                        </div>
                        <Badge bg={getActivityColor(activity.status)} className="ms-2">
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-lightning me-2"></i>
                Acciones Rápidas
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" onClick={() => navigate('/models/create')}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Nuevo Modelo
                </Button>
                <Button variant="outline-success" onClick={() => navigate('/data/upload')}>
                  <i className="bi bi-cloud-upload me-2"></i>
                  Cargar Dataset
                </Button>
                <Button variant="outline-info" onClick={() => navigate('/analysis')}>
                  <i className="bi bi-bar-chart me-2"></i>
                  Nuevo Análisis
                </Button>
                <Button variant="outline-warning" onClick={() => navigate('/predictions')}>
                  <i className="bi bi-graph-up me-2"></i>
                  Ver Predicciones
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;