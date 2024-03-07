import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => Promise<void>;
}

export const SupplierOptions = ({
  id,
  setIsModalOpen,
  handleDelete,
}: Props) => {
  const navigate = useNavigate();

  const redirectBankAccounts = () => {
    navigate(`/proveedores/${id}/cuentas-bancarias`);
  };

  return (
    <div>
      <h2 className="fs-6 mt-2">Menú de opciones</h2>
      <div className="list-group small">
        <button
          className="list-group-item list-group-item-action py-1"
          title="Cuentas bancarias del proveedor"
          onClick={redirectBankAccounts}
        >
          <i className="bi bi-bank me-2 fs-6"></i>
          Cuentas bancarias
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Registrar una nueva compra"
          disabled
        >
          <i className="bi bi-cart-plus-fill me-2 fs-6"></i>
          Registrar una nueva compra
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Compras registradas del proveedor"
          disabled
        >
          <i className="bi bi-cart4 me-2 fs-6"></i>
          Compras registradas
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Pagos realizados al proveedor"
          disabled
        >
          <i className="bi bi-cash-stack me-2 fs-6"></i>
          Pagos realizados
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Modificar información del proveedor"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="bi bi-pencil me-2 fs-6"></i>
          Modificar información del proveedor
        </button>
        <button
          className="list-group-item list-group-item-action py-1 text-danger"
          title="Eliminar proveedor"
          onClick={handleDelete}
        >
          <i className="bi bi-trash me-2 fs-6"></i>
          Eliminar proveedor
        </button>
      </div>
    </div>
  );
};
