interface Props {
  handleOpen: () => void;
  handleDelete: () => void;
}

export const Options = ({ handleOpen, handleDelete }: Props) => {
  return (
    <div>
      <div className="list-group small">
        <button
          className="list-group-item list-group-item-action py-1"
          title="Modificar datos del artículo"
          onClick={handleOpen}
        >
          <i className="bi bi-pencil me-2 fs-6"></i>
          Modificar datos del artículo
        </button>
        <button
          className="list-group-item list-group-item-action py-1 text-danger"
          title="Eliminar artículo del inventario"
          onClick={handleDelete}
        >
          <i className="bi bi-x-circle-fill me-2 fs-6"></i>
          Eliminar artículo del inventario
        </button>
      </div>
    </div>
  );
};