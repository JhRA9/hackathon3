import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AIModel } from '../types';

const ModelsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [models, setModels] = useState<AIModel[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    description: '',
    type: 'classification' as AIModel['type'],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Datos simulados de modelos
    setModels([
      {
        id: '1',
        name: 'Clasificador de Sentimientos',
        description: 'Modelo para análisis de sentimientos en texto',
        type: 'nlp',
        accuracy: 94.2,
        status: 'ready',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: '2',
        name: 'Predictor de Ventas',
        description: 'Modelo predictivo para forecasting de ventas',
        type: 'regression',
        accuracy: 89.7,
        status: 'ready',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-25'),
      },
      {
        id: '3',
        name: 'Clasificador de Imágenes',
        description: 'Reconocimiento de objetos en imágenes',
        type: 'computer-vision',
        status: 'training',
        createdAt: new Date('2024-01-30'),
        updatedAt: new Date('2024-01-30'),
      },
    ]);
  }, [isAuthenticated, navigate]);

  const getStatusBadge = (status: AIModel['status']) => {
    switch (status) {
      case 'ready': return <Badge bg="success">Listo</Badge>;
      case 'training': return <Badge bg="warning">Entrenando</Badge>;
      case 'error': return <Badge bg="danger">Error</Badge>;
      default: return <Badge bg="secondary">Desconocido</Badge>;
    }
  };

  const getTypeLabel = (type: AIModel['type']) => {
    switch (type) {
      case 'classification': return 'Clasificación';
      case 'regression': return 'Regresión';
      case 'clustering': return 'Clustering';
      case 'nlp': return 'NLP';
      case 'computer-vision': return 'Visión Computacional';
      default: return type;
    }
  };

  const handleCreateModel = () => {
    const model: AIModel = {
      id: Date.now().toString(),
      ...newModel,
      status: 'training',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setModels(prev => [...prev, model]);
    setShowCreateModal(false);
    setNewModel({ name: '', description: '', type: 'classification' });
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold mb-2">Modelos de IA</h1>
              <p className="text-muted mb-0">Gestiona tus modelos de machine learning</p>
            </div>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <i className="bi bi-plus-circle me-2"></i>
              Crear Modelo
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              {models.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-robot display-1 text-muted"></i>
                  <h4 className="mt-3">No hay modelos aún</h4>
                  <p className="text-muted">Crea tu primer modelo de IA</p>
                  <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    Crear Primer Modelo
                  </Button>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Precisión</th>
                      <th>Estado</th>
                      <th>Creado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {models.map((model) => (
                      <tr key={model.id}>
                        <td>
                          <div>
                            <div className="fw-semibold">{model.name}</div>
                            <small className="text-muted">{model.description}</small>
                          </div>
                        </td>
                        <td>{getTypeLabel(model.type)}</td>
                        <td>
                          {model.accuracy ? (
                            <span className="fw-semibold text-success">
                              {model.accuracy}%
                            </span>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                        <td>{getStatusBadge(model.status)}</td>
                        <td>{model.createdAt.toLocaleDateString()}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm">
                              <i className="bi bi-eye"></i>
                            </Button>
                            <Button variant="outline-success" size="sm">
                              <i className="bi bi-play"></i>
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              <i className="bi bi-trash"></i>
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

      {/* Modal para crear modelo */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Modelo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Modelo</Form.Label>
              <Form.Control
                type="text"
                value={newModel.name}
                onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Clasificador de Emociones"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newModel.description}
                onChange={(e) => setNewModel(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe el propósito del modelo..."
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Modelo</Form.Label>
              <Form.Select
                value={newModel.type}
                onChange={(e) => setNewModel(prev => ({ ...prev, type: e.target.value as AIModel['type'] }))}
              >
                <option value="classification">Clasificación</option>
                <option value="regression">Regresión</option>
                <option value="clustering">Clustering</option>
                <option value="nlp">Procesamiento de Lenguaje Natural</option>
                <option value="computer-vision">Visión Computacional</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateModel}>
            Crear Modelo
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ModelsPage;