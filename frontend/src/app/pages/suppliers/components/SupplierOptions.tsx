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

  const redirectAccounts = () => {
    navigate(`/proveedores/${id}/cuentas`);
  };

  const redirectPurchases = () => {
    navigate(`/proveedores/${id}/compras`);
  };

  return (
    <>
      <div className="list-group small">
        <div className="list-group-item py-1 fw-bold text-muted text-uppercase text-center bg-light">
          Opciones del proveedor
        </div>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Cuentas bancarias del proveedor"
          onClick={redirectBankAccounts}
        >
          <i className="bi bi-bank me-2 fs-6"></i>
          Datos de cuentas bancarias
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Cuentas corrientes del proveedor"
          onClick={redirectAccounts}
        >
          <i className="bi bi-wallet2 me-2 fs-6"></i>
          Gestionar cuentas corrientes
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Ver compras realizadas al proveedor"
          onClick={redirectPurchases}
        >
          <i className="bi bi-cart me-2 fs-6"></i>
          Ver compras realizadas al proveedor
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
          <i className="bi bi-x-circle-fill me-2 fs-6"></i>
          Eliminar proveedor
        </button>
      </div>
    </>
  );
};
