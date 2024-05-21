import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => Promise<void>;
}

export const Options = ({ id, setIsModalOpen, handleDelete }: Props) => {
  const navigate = useNavigate();

  const redirectAccounts = () => {
    navigate(`/entidades/${id}/cuentas`);
  };

  return (
    <>
      <div className="list-group small">
        <div className="list-group-item py-1 fw-bold text-muted text-uppercase text-center bg-light">
          Opciones de la entidad
        </div>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Ver cuentas corrientes de la entidad"
          onClick={redirectAccounts}
        >
          <i className="bi bi-wallet2 me-2 fs-6"></i>
          Gestionar cuentas corrientes
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Modificar información de la entidad"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="bi bi-pencil me-2 fs-6"></i>
          Modificar información de la entidad
        </button>
        <button
          className="list-group-item list-group-item-action py-1 text-danger"
          title="Eliminar entidad"
          onClick={handleDelete}
        >
          <i className="bi bi-x-circle-fill me-2 fs-6"></i>
          Eliminar entidad
        </button>
      </div>
    </>
  );
};
