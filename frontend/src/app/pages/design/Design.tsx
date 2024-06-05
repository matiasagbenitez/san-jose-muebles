import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { StatusColor } from "../environments/interfaces";
import "./styles.css";

export const Design = () => {
  return (
    <div>
      <ListGroup horizontal="xl" className="small mb-3">
        <ListGroup.Item action>
          <i className="bi bi-arrow-left me-2"></i>
          Volver atrás
        </ListGroup.Item>
        <ListGroup.Item action>
          <i className="bi bi-plus-circle me-2"></i>
          Registrar nueva tarea
        </ListGroup.Item>
        <ListGroup.Item action>
          <i className="bi bi-images me-2"></i>
          Renders e imágenes
        </ListGroup.Item>
        <ListGroup.Item action>
          <i className="bi bi-paperclip me-2"></i>
          Archivos y documentos
        </ListGroup.Item>
        <ListGroup.Item action>
          <i className="bi bi-clock-history me-2"></i>
          Cambios de estado
        </ListGroup.Item>
        <ListGroup.Item action>
          <i className="bi bi-people me-2"></i>
          Usuarios asignados
        </ListGroup.Item>
      </ListGroup>

      <h5 className="py-1">
        <span className="fw-normal">Instancia de diseño: </span>
        OFICINA - OFICINAS LOCAL COMERCIAL - FERRETERIA AVENIDA
      </h5>
      <Row>
        <Col xs={12} xl={8}>
          <h6>Tablero de tareas</h6>
          <div
            className=" d-flex overflow-auto kanban-container bg-light"
            style={{ height: "calc(100vh - 220px)" }}
          >
            <div className="kanban-column border">
              <div className="kanban-header">
                <i className="bi bi-clock-fill me-2 text-warning"></i>
                PENDIENTES
              </div>
              <div className="kanban-content">
                {Array.from({ length: 15 }).map((_, index) => (
                  <Card className="mb-3 small">
                    <Card.Header>
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <Card.Subtitle className="text-center">
                          <strong>#{index + 1}</strong>
                        </Card.Subtitle>
                        <Button
                          variant="transparent"
                          size="sm"
                          className="py-0 px-1"
                          title="Actualizar tarea"
                        >
                          <i className="bi bi-three-dots"></i>
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text className="text-muted fw-bold">
                        Title of the task
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
            <div className="kanban-column border">
              <div className="kanban-header">
                <i
                  className="bi bi-play-circle-fill me-2"
                  style={{ color: StatusColor.PROCESO }}
                ></i>
                EN PROCESO
              </div>
              <div className="kanban-content">
                {/* Contenido de la columna */}
              </div>
            </div>
            <div className="kanban-column border">
              <div className="kanban-header">
                <i className="bi bi-check-circle-fill me-2 text-success"></i>
                FINALIZADAS
              </div>
              <div className="kanban-content">
                {/* Contenido de la columna */}
              </div>
            </div>

            <div className="kanban-column border">
              <div className="kanban-header">
                <i className="bi bi-archive-fill me-2 text-secondary"></i>
                ARCHIVADAS
              </div>
              <div className="kanban-content">
                {/* Contenido de la columna */}
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} xl={4}>
          <h6 className="mt-3 mt-xl-0">Últimos comentarios</h6>
          <ListGroup className="small mb-3 overflow-auto" 
            style={{ height: "calc(100vh - 220px)" }}>
           {Array.from({ length: 10 }).map((_, index) => (  
             <ListGroup.Item>
             <p className="mb-0 fw-bold">
               matiasagbenitez{" "}
               <span className="text-muted fw-normal small fst-italic ms-2">
                 hace 7m
               </span>
             </p>
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
             deserunt, explicabo nulla numquam fugiat placeat perferendis
             inventore hic repellendus rerum, optio quibusdam totam magni nam
             veritatis error in voluptatem alias?
           </ListGroup.Item>
              ))}
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
};
