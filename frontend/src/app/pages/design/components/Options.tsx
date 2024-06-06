import { useNavigate } from "react-router-dom";
import { ListGroup } from "react-bootstrap";

interface Props {
  id: string;
}

export const Options = ({ id }: Props) => {
  const navigate = useNavigate();

  const redirectHistorial = () => {
    navigate(`/disenos/${id}/historial`);
  };
  
  return (
    <ListGroup horizontal="xl" className="small mb-3">
      <ListGroup.Item action onClick={() => navigate("/disenos")}>
        <i className="bi bi-arrow-left me-2"></i>
        Volver atrás
      </ListGroup.Item>
      <ListGroup.Item action onClick={redirectHistorial}>
        <i className="bi bi-clock-history me-2"></i>
        Historial de cambios de estado
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
        <i className="bi bi-people me-2"></i>
        Usuarios asignados
      </ListGroup.Item>
    </ListGroup>
  );
};
