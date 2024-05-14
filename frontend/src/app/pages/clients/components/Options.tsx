import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => Promise<void>;
}

export const ClientOptions = ({ id, setIsModalOpen, handleDelete }: Props) => {
  const navigate = useNavigate();

  const redirectProjects = () => {
    navigate(`/clientes/${id}/proyectos`);
  };

  return (
    <>
      <div className="list-group small">
        <div className="list-group-item py-1 fw-bold text-muted text-uppercase text-center bg-light">
          Opciones del cliente
        </div>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Ver proyectos del cliente"
          onClick={redirectProjects}
        >
          <i className="bi bi-houses me-2 fs-6"></i>
          Listado de proyectos del cliente
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Modificar información del cliente"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="bi bi-pencil me-2 fs-6"></i>
          Modificar información del cliente
        </button>
        <button
          className="list-group-item list-group-item-action py-1 text-danger"
          title="Eliminar cliente"
          onClick={handleDelete}
        >
          <i className="bi bi-x-circle-fill me-2 fs-6"></i>
          Eliminar cliente
        </button>
      </div>
    </>
  );
};
