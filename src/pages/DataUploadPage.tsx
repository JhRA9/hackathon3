import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar, Table, Badge } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface DatasetFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  uploadProgress?: number;
  rows?: number;
  columns?: string[];
  uploadedAt: Date;
}

const DataUploadPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [datasets, setDatasets] = useState<DatasetFile[]>([
    {
      id: '1',
      name: 'ventas_2024.csv',
      size: 2048576,
      type: 'csv',
      status: 'ready',
      rows: 15000,
      columns: ['fecha', 'producto', 'cantidad', 'precio', 'cliente'],
      uploadedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'clientes_base.xlsx',
      size: 1024000,
      type: 'excel',
      status: 'ready',
      rows: 5000,
      columns: ['id_cliente', 'nombre', 'email', 'edad', 'ciudad'],
      uploadedAt: new Date('2024-01-20'),
    },
  ]);
  const [datasetInfo, setDatasetInfo] = useState({
    name: '',
    description: '',
    category: 'sales',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!allowedTypes.includes(file.type)) {
        setError('Tipo de archivo no soportado. Use CSV, JSON, XLS o XLSX.');
        return;
      }

      // Validar tamaño (máximo 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Máximo 50MB.');
        return;
      }

      setSelectedFile(file);
      setError('');
      setDatasetInfo(prev => ({
        ...prev,
        name: file.name.split('.')[0],
      }));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !datasetInfo.name) {
      setError('Por favor, selecciona un archivo y proporciona un nombre.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    // Simular proceso de carga
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          
          // Agregar el nuevo dataset
          const newDataset: DatasetFile = {
            id: Date.now().toString(),
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type.includes('csv') ? 'csv' : 
                  selectedFile.type.includes('json') ? 'json' : 'excel',
            status: 'processing',
            uploadedAt: new Date(),
          };

          setDatasets(prev => [newDataset, ...prev]);
          
          // Simular procesamiento
          setTimeout(() => {
            setDatasets(prev => prev.map(d => 
              d.id === newDataset.id 
                ? { 
                    ...d, 
                    status: 'ready', 
                    rows: Math.floor(Math.random() * 10000) + 1000,
                    columns: ['col1', 'col2', 'col3', 'col4', 'col5']
                  } 
                : d
            ));
          }, 2000);
          
          setUploading(false);
          setSelectedFile(null);
          setDatasetInfo({ name: '', description: '', category: 'sales' });
          setSuccess('Dataset cargado y procesado exitosamente');
          setTimeout(() => setSuccess(''), 5000);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: DatasetFile['status']) => {
    switch (status) {
      case 'ready': return <Badge bg="success">Listo</Badge>;
      case 'processing': return <Badge bg="warning">Procesando</Badge>;
      case 'uploading': return <Badge bg="info">Subiendo</Badge>;
      case 'error': return <Badge bg="danger">Error</Badge>;
      default: return <Badge bg="secondary">Desconocido</Badge>;
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold mb-2">Cargar Datos</h1>
          <p className="text-muted mb-0">Sube tus datasets para análisis de IA</p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {success && (
        <Row className="mb-4">
          <Col>
            <Alert variant="success">
              <i className="bi bi-check-circle me-2"></i>
              {success}
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-cloud-upload me-2"></i>
                Subir Nuevo Dataset
              </h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Nombre del Dataset</Form.Label>
                      <Form.Control
                        type="text"
                        value={datasetInfo.name}
                        onChange={(e) => setDatasetInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: Datos de ventas Q1 2024"
                        disabled={uploading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Categoría</Form.Label>
                      <Form.Select
                        value={datasetInfo.category}
                        onChange={(e) => setDatasetInfo(prev => ({ ...prev, category: e.target.value }))}
                        disabled={uploading}
                      >
                        <option value="sales">Ventas</option>
                        <option value="marketing">Marketing</option>
                        <option value="finance">Finanzas</option>
                        <option value="operations">Operaciones</option>
                        <option value="hr">Recursos Humanos</option>
                        <option value="other">Otro</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={datasetInfo.description}
                    onChange={(e) => setDatasetInfo(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe el contenido y propósito de este dataset..."
                    disabled={uploading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Archivo</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileSelect}
                    accept=".csv,.json,.xls,.xlsx"
                    disabled={uploading}
                  />
                  <Form.Text className="text-muted">
                    Formatos soportados: CSV, JSON, XLS, XLSX. Tamaño máximo: 50MB
                  </Form.Text>
                </Form.Group>

                {selectedFile && (
                  <div className="mb-3 p-3 bg-light rounded">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-file-earmark-text text-primary me-2"></i>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{selectedFile.name}</div>
                        <small className="text-muted">{formatFileSize(selectedFile.size)}</small>
                      </div>
                    </div>
                  </div>
                )}

                {uploading && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Subiendo archivo...</small>
                      <small>{uploadProgress}%</small>
                    </div>
                    <ProgressBar now={uploadProgress} />
                  </div>
                )}

                <Button
                  variant="primary"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? (
                    <>
                      <i className="bi bi-arrow-clockwise spin me-2"></i>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-upload me-2"></i>
                      Subir Dataset
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h6 className="fw-bold mb-0">Estadísticas</h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <i className="bi bi-database text-primary display-4 mb-2"></i>
                <h4 className="fw-bold">{datasets.length}</h4>
                <p className="text-muted mb-0">Datasets Totales</p>
              </div>
              
              <div className="row text-center">
                <div className="col-6">
                  <div className="fw-bold text-success">
                    {datasets.filter(d => d.status === 'ready').length}
                  </div>
                  <small className="text-muted">Listos</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-warning">
                    {datasets.filter(d => d.status === 'processing').length}
                  </div>
                  <small className="text-muted">Procesando</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-table me-2"></i>
                Mis Datasets
              </h5>
            </Card.Header>
            <Card.Body>
              {datasets.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                  <h4 className="mt-3">No hay datasets</h4>
                  <p className="text-muted">Sube tu primer dataset para comenzar</p>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Tamaño</th>
                      <th>Filas</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datasets.map((dataset) => (
                      <tr key={dataset.id}>
                        <td>
                          <div className="fw-semibold">{dataset.name}</div>
                        </td>
                        <td>
                          <Badge bg="secondary">{dataset.type.toUpperCase()}</Badge>
                        </td>
                        <td>{formatFileSize(dataset.size)}</td>
                        <td>
                          {dataset.rows ? dataset.rows.toLocaleString() : 'N/A'}
                        </td>
                        <td>{getStatusBadge(dataset.status)}</td>
                        <td>{dataset.uploadedAt.toLocaleDateString()}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm">
                              <i className="bi bi-eye"></i>
                            </Button>
                            <Button variant="outline-success" size="sm">
                              <i className="bi bi-download"></i>
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
    </Container>
  );
};

export default DataUploadPage;