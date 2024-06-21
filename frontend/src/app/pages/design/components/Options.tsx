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

  const redirectUploadFiles = () => {
    navigate(`/disenos/${id}/subir-archivos`);
  };

  const redirectFiles = () => {
    navigate(`/disenos/${id}/archivos`);
  };

  return (
    <ListGroup horizontal="xl" className="small mb-3">
      <ListGroup.Item action onClick={() => navigate("/disenos")}>
        <i className="bi bi-arrow-left me-2"></i>
        Volver al listado de diseños
      </ListGroup.Item>
      <ListGroup.Item action onClick={redirectHistorial}>
        <i className="bi bi-clock-history me-2"></i>
        Historial de cambios de estado
      </ListGroup.Item>
      <ListGroup.Item action onClick={redirectFiles}>
        <i className="bi bi-folder me-2"></i>
        Archivos subidos
      </ListGroup.Item>
      <ListGroup.Item action onClick={redirectUploadFiles}>
        <i className="bi bi-upload me-2"></i>
        Subir archivos de diseño
      </ListGroup.Item>
      <ListGroup.Item action>
        <i className="bi bi-people me-2"></i>
        Usuarios asignados
      </ListGroup.Item>
    </ListGroup>
  );
};
