import { Accordion, Button, Card, Col, ListGroup, Row } from "react-bootstrap";
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
          Evolución del diseño
        </ListGroup.Item>
        <ListGroup.Item action>
          <i className="bi bi-people me-2"></i>
          Usuarios asignados
        </ListGroup.Item>
      </ListGroup>

      <Accordion className="mb-3 p-0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span>
              Instancia de diseño:{" "}
              <b>OFICINA - OFICINAS LOCAL COMERCIAL - FERRETERIA AVENIDA</b>
            </span>
          </Accordion.Header>
          <Accordion.Body className="p-">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Row>
        <Col xs={12} xl={8}>
          <h6>Tablero de tareas</h6>
          <div
            className=" d-flex overflow-auto kanban-container"
            style={{ height: "calc(100vh - 250px)" }}
          >
            <div className="kanban-column border">
              <div className="kanban-header bg-light bg-light">
                <i className="bi bi-clock-fill me-2 text-warning"></i>
                PENDIENTES
              </div>
              <div className="kanban-content">
                {Array.from({ length: 15 }).map((_, index) => (
                  <Card className="my-2 small">
                    <Card.Header>
                      <div className="d-flex align-items-center justify-content-between">
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
              <div className="kanban-header bg-light">
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
              <div className="kanban-header bg-light">
                <i className="bi bi-check-circle-fill me-2 text-success"></i>
                FINALIZADAS
              </div>
              <div className="kanban-content">
                {/* Contenido de la columna */}
              </div>
            </div>

            <div className="kanban-column border">
              <div className="kanban-header bg-light">
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
          <h6 className="mt-3 mt-xl-0">
            Últimos comentarios o actualizaciones
          </h6>
          <ListGroup
            className="small mb-3 overflow-auto"
            style={{ height: "calc(100vh - 250px)" }}
          >
            <ListGroup.Item className="d-flex">
              <textarea
                className="form-control"
                placeholder="Escribe un comentario..."
                rows={1}
              ></textarea>
              <Button
                title="Enviar comentario"
                variant="success"
                size="sm"
                className="small ms-2 align-self-end"
              >
                <i className="bi bi-send-fill"></i>
              </Button>
            </ListGroup.Item>
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
            <ListGroup.Item>
              <Button size="sm" variant="link" title="Ver más comentarios">
                Ver todos los comentarios...
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
};
