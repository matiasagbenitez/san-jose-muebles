import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
}

export const Options = ({ id }: Props) => {
  const navigate = useNavigate();

  const redirectAccounts = () => {
    navigate(`/proyectos/${id}/cuentas`);
  };

  return (
    <>
      <div className="list-group small">
        <div className="list-group-item py-1 fw-bold text-muted text-uppercase text-center bg-light">
          Opciones del proyecto
        </div>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Cuentas corrientes del proyecto"
          onClick={redirectAccounts}
        >
          <i className="bi bi-wallet2 me-2 fs-6"></i>
          Gestionar cuentas corrientes
        </button>
        <button
          hidden
          className="list-group-item list-group-item-action py-1"
          title="Presupuestos del proyecto"
        >
          <i className="bi bi-journals me-2 fs-6"></i>
          Presupuestos del proyecto
        </button>

        <button
          hidden
          className="list-group-item list-group-item-action py-1"
          title="Modificar información del proyecto"
        >
          <i className="bi bi-pencil me-2 fs-6"></i>
          Modificar información del proyecto
        </button>
        <button
          hidden
          className="list-group-item list-group-item-action py-1"
          title="Gestionar ambientes del proyecto"
        >
          <i className="bi bi-card-list me-2 fs-6"></i>
          Gestionar ambientes del proyecto
        </button>
        <button
          hidden
          className="list-group-item list-group-item-action py-1"
          title="Actualizar estado del proyecto"
        >
          <i className="bi bi-repeat me-2 fs-6"></i>
          Actualizar estado del proyecto
        </button>
        <button
          hidden
          className="list-group-item list-group-item-action py-1"
          title="Actualizar fecha estimada de entrega"
        >
          <i className="bi bi-clock me-2 fs-6"></i>
          Actualizar fecha estimada de entrega
        </button>
        <button
          hidden
          className="list-group-item list-group-item-action py-1"
          title="Personas relacionadas al proyecto"
        >
          <i className="bi bi-people me-2 fs-6"></i>
          Personas relacionadas al proyecto
        </button>
        <button
          hidden
          className="list-group-item list-group-item-action py-1"
          title="Archivos adjuntos"
        >
          <i className="bi bi-archive me-2 fs-6"></i>
          Archivos adjuntos
        </button>
        <button
          hidden
          className="list-group-item list-group-item-action py-1 text-danger"
          title="Eliminar proyecto"
        >
          <i className="bi bi-x-circle-fill me-2 fs-6"></i>
          Eliminar proyecto
        </button>
      </div>
    </>
  );
};
