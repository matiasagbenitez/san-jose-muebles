import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
}

export const Options = ({ id }: Props) => {
  const navigate = useNavigate();

  const redirectAccounts = () => {
    navigate(`/proyectos/${id}/cuentas`);
  };

  const redirectUpdate = () => {
    navigate(`/proyectos/${id}/editar`);
  };

  const redirectEstimates = () => {
    navigate(`/proyectos/${id}/presupuestos`);
  };

  const redirectRelatedPersons = () => {
    navigate(`/proyectos/${id}/personas-relacionadas`);
  };

  const redirectEnvironments = () => {
    navigate(`/proyectos/${id}/ambientes`);
  };

  return (
    <>
      {/* <h6>Menú de opciones del proyecto</h6> */}
      <ListGroup horizontal="xl" className="small mb-3">
        <ListGroup.Item action onClick={redirectEnvironments}>
          <i className="bi bi-card-list me-2 fs-6"></i>
          Ambientes del proyecto
        </ListGroup.Item>
        <ListGroup.Item action onClick={redirectAccounts}>
          <i className="bi bi-wallet2 me-2 fs-6"></i>
          Cuentas corrientes
        </ListGroup.Item>
        <ListGroup.Item action onClick={redirectEstimates}>
          <i className="bi bi-journals me-2 fs-6"></i>
          Presupuestos del proyecto
        </ListGroup.Item>
        <ListGroup.Item action onClick={redirectRelatedPersons}>
          <i className="bi bi-person-lines-fill me-2 fs-6"></i>
          Personas relacionadas
        </ListGroup.Item>
        <ListGroup.Item action onClick={redirectUpdate}>
          <i className="bi bi-pencil me-2 fs-6"></i>
          Modificar información
        </ListGroup.Item>
      </ListGroup>
    </>
  );
};
