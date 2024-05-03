import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
  handleDelete: () => Promise<void>;
  handleUpdateStatus: () => void;
}

export const VisitRequestOptions = ({
  id,
  handleDelete,
  handleUpdateStatus,
}: Props) => {
  const navigate = useNavigate();

  const redirectEdit = () => {
    navigate(`/agenda/${id}/editar`);
  };

  const redirectAuditing = () => {
    navigate(`/agenda/${id}/auditoria`);
  }

  return (
    <div>
      <h2 className="fs-6 mt-3">Menú de opciones</h2>
      <div className="list-group small" style={{ marginTop: "10px" }}>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Actualizar estado de la visita"
          onClick={handleUpdateStatus}
        >
          <i className="bi bi-list-ul me-2 fs-6"></i>
          Actualizar estado de la visita
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Modificar información de la visita"
          onClick={redirectEdit}
        >
          <i className="bi bi-pencil me-2 fs-6"></i>
          Modificar datos de la visita
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Historial de modificaciones"
          onClick={redirectAuditing}
        >
          <i className="bi bi-search me-2 fs-6"></i>
          Historial de modificaciones
        </button>
        <button
          className="list-group-item list-group-item-action py-1 text-danger"
          title="Eliminar visita"
          onClick={handleDelete}
        >
          <i className="bi bi-x-circle-fill me-2 fs-6"></i>
          Eliminar registro del sistema
        </button>
      </div>
    </div>
  );
};
