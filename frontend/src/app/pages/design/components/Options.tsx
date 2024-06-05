import { ListGroup } from "react-bootstrap";

export const Options = () => {
  return (
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
  );
};
