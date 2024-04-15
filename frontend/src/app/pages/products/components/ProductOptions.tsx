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
    navigate(`/productos/${id}/ajuste-stock`);
  }

  return (
    <div>
      <h2 className="fs-6">Menú de opciones</h2>
      <div className="list-group small">
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
          title="Ajustar stock del producto"
          onClick={redirectUpdateStock}
        >
          <i className="bi bi-box-arrow-in-down me-2 fs-6"></i>
          Ajustar stock del producto
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
    </div>
  );
};
