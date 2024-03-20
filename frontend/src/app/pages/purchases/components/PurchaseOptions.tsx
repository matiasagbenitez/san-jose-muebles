import { useNavigate } from "react-router-dom";

export const PurchaseOptions = ({
  id,
  isFullyStocked,
  nullifyPurchase,
  isNullified,
  updatePurchaseFullStock,
}: {
  id: number;
  isFullyStocked: boolean;
  nullifyPurchase: () => void;
  isNullified: boolean;
  updatePurchaseFullStock: () => void;
}) => {
  const navigate = useNavigate();

  const handleRedirectPayments = () => {
    navigate(`/compras/${id}/pagos`);
  };

  return (
    <div className="mb-4">
      <h2 className="fs-6 mt-2">Menú de opciones</h2>
      <div className="list-group small">
        <button
          className="list-group-item list-group-item-action py-1"
          title="Registrar un pago"
          onClick={handleRedirectPayments}
        >
          <i className="bi bi-cash-stack me-2 fs-6"></i>
          Registrar un pago en concepto de esta compra
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Marcar todos los productos como recibidos"
          onClick={updatePurchaseFullStock}
          disabled={isNullified || isFullyStocked}
        >
          <i className="bi bi-check2-square me-2 fs-56"></i>
          Marcar todos los productos como recibidos
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Ver registros de recepción de productos"
        >
          <i className="bi bi-search me-2 fs-56"></i>
          Ver registros de recepción de productos
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Generar un reporte de la compra"
        >
          <i className="bi bi-receipt me-2 fs-56"></i>
          Generar un reporte de la compra
        </button>
        <button
          className="list-group-item list-group-item-action py-1 text-danger"
          title="Anular compra (esta acción no se puede deshacer)"
          onClick={nullifyPurchase}
          disabled={isNullified}
          hidden={isNullified}
        >
          <i className="bi bi-x-circle-fill me-2 fs-6"></i>
          Anular compra
        </button>
      </div>
    </div>
  );
};
