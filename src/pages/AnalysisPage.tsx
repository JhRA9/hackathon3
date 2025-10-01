import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AnalysisData {
  id: string;
  name: string;
  type: 'descriptive' | 'diagnostic' | 'predictive' | 'prescriptive';
  dataset: string;
  status: 'running' | 'completed' | 'failed';
  accuracy?: number;
  createdAt: Date;
}

const AnalysisPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Datos simulados
    setAnalyses([
      {
        id: '1',
        name: 'Análisis de Tendencias de Ventas',
        type: 'predictive',
        dataset: 'Ventas Q4 2024',
        status: 'completed',
        accuracy: 92.5,
        createdAt: new Date('2024-01-20'),
      },
      {
        id: '2',
        name: 'Segmentación de Clientes',
        type: 'descriptive',
        dataset: 'Base de Clientes',
        status: 'completed',
        accuracy: 87.3,
        createdAt: new Date('2024-01-18'),
      },
      {
        id: '3',
        name: 'Predicción de Demanda',
        type: 'predictive',
        dataset: 'Inventario 2024',
        status: 'running',
        createdAt: new Date('2024-01-25'),
      },
    ]);
  }, [isAuthenticated, navigate]);

  const getStatusBadge = (status: AnalysisData['status']) => {
    switch (status) {
      case 'completed': return <Badge bg="success">Completado</Badge>;
      case 'running': return <Badge bg="warning">Ejecutando</Badge>;
      case 'failed': return <Badge bg="danger">Fallido</Badge>;
      default: return <Badge bg="secondary">Desconocido</Badge>;
    }
  };

  const getTypeLabel = (type: AnalysisData['type']) => {
    switch (type) {
      case 'descriptive': return 'Descriptivo';
      case 'diagnostic': return 'Diagnóstico';
      case 'predictive': return 'Predictivo';
      case 'prescriptive': return 'Prescriptivo';
      default: return type;
    }
  };

  const filteredAnalyses = selectedType === 'all' 
    ? analyses 
    : analyses.filter(analysis => analysis.type === selectedType);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold mb-2">Análisis de Datos</h1>
              <p className="text-muted mb-0">Descubre insights valiosos en tus datos</p>
            </div>
            <Button variant="primary">
              <i className="bi bi-plus-circle me-2"></i>
              Nuevo Análisis
            </Button>
          </div>
        </Col>
      </Row>

      {/* Estadísticas rápidas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-bar-chart text-primary display-4 mb-2"></i>
              <h3 className="fw-bold">{analyses.length}</h3>
              <p className="text-muted mb-0">Análisis Totales</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-check-circle text-success display-4 mb-2"></i>
              <h3 className="fw-bold">{analyses.filter(a => a.status === 'completed').length}</h3>
              <p className="text-muted mb-0">Completados</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-clock text-warning display-4 mb-2"></i>
              <h3 className="fw-bold">{analyses.filter(a => a.status === 'running').length}</h3>
              <p className="text-muted mb-0">En Proceso</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-graph-up text-info display-4 mb-2"></i>
              <h3 className="fw-bold">
                {(analyses.filter(a => a.accuracy).reduce((sum, a) => sum + (a.accuracy || 0), 0) / 
                  analyses.filter(a => a.accuracy).length || 0).toFixed(1)}%
              </h3>
              <p className="text-muted mb-0">Precisión Promedio</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <Row className="align-items-center">
                <Col>
                  <h5 className="fw-bold mb-0">Historial de Análisis</h5>
                </Col>
                <Col xs="auto">
                  <Form.Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="descriptive">Descriptivo</option>
                    <option value="diagnostic">Diagnóstico</option>
                    <option value="predictive">Predictivo</option>
                    <option value="prescriptive">Prescriptivo</option>
                  </Form.Select>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {filteredAnalyses.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-graph-down display-1 text-muted"></i>
                  <h4 className="mt-3">No hay análisis disponibles</h4>
                  <p className="text-muted">Crea tu primer análisis de datos</p>
                  <Button variant="primary">
                    Comenzar Análisis
                  </Button>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Dataset</th>
                      <th>Precisión</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnalyses.map((analysis) => (
                      <tr key={analysis.id}>
                        <td>
                          <div className="fw-semibold">{analysis.name}</div>
                        </td>
                        <td>
                          <Badge bg="info" className="text-white">
                            {getTypeLabel(analysis.type)}
                          </Badge>
                        </td>
                        <td>{analysis.dataset}</td>
                        <td>
                          {analysis.accuracy ? (
                            <span className="fw-semibold text-success">
                              {analysis.accuracy}%
                            </span>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                        <td>{getStatusBadge(analysis.status)}</td>
                        <td>{analysis.createdAt.toLocaleDateString()}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm">
                              <i className="bi bi-eye"></i>
                            </Button>
                            <Button variant="outline-success" size="sm">
                              <i className="bi bi-download"></i>
                            </Button>
                            <Button variant="outline-info" size="sm">
                              <i className="bi bi-share"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AnalysisPage;