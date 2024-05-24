import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
  handleDelete: () => Promise<void>;
}

export const ProductOptions = ({ id, handleDelete }: Props) => {
  const navigate = useNavigate();

  const redirectEditProduct = () => {
    navigate(`/productos/${id}/editar`);
  };

  const redirectUpdateStock = () => {
    navigate(`/productos/${id}/ajustes`);
  };

  return (
    <div className="list-group small">
      <div className="list-group-item py-1 fw-bold text-muted text-uppercase text-center bg-light">
        Opciones del producto
      </div>
      <button
        className="list-group-item list-group-item-action py-1"
        title="Modificar información del producto"
        onClick={redirectEditProduct}
      >
        <i className="bi bi-pencil me-2 fs-6"></i>
        Modificar información del producto
      </button>
      <button
        className="list-group-item list-group-item-action py-1"
        title="Flujo de stock del producto"
        onClick={redirectUpdateStock}
      >
        <i className="bi bi-list-ul me-2 fs-6"></i>
        Flujo de stock del producto
      </button>
      <button
        className="list-group-item list-group-item-action py-1 text-danger"
        title="Eliminar producto"
        onClick={handleDelete}
      >
        <i className="bi bi-x-circle-fill me-2 fs-6"></i>
        Eliminar producto
      </button>
    </div>
  );
};
