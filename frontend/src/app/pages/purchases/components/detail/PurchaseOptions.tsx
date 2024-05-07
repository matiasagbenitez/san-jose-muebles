import { useNavigate } from "react-router-dom";

export const PurchaseOptions = ({
  id,
  isFullyStocked,
  nullifyPurchase,
  status,
  updatePurchaseFullStock,
  accountId,
}: {
  id: number;
  isFullyStocked: boolean;
  nullifyPurchase: () => void;
  status: "VALIDA" | "ANULADA";
  updatePurchaseFullStock: () => void;
  accountId: number;
}) => {
  const navigate = useNavigate();

  const handleRedirectReceptions = () => {
    navigate(`/compras/${id}/recepciones`);
  };

  const handleRedirectAccount = () => {
    navigate(`/cuentas-proveedores/${accountId}`);
  };

  return (
    <div className="mb-4">
      <h2 className="fs-6 mt-3">Menú de opciones</h2>
      <div className="list-group small" style={{ marginTop: "10px" }}>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Marcar todos los productos como recibidos"
          onClick={updatePurchaseFullStock}
          disabled={status === "ANULADA" || isFullyStocked}
        >
          <i className="bi bi-check2-square me-2 fs-56"></i>
          Marcar todos los productos como recibidos
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Ver registros de recepción de productos"
          onClick={handleRedirectReceptions}
        >
          <i className="bi bi-search me-2 fs-56"></i>
          Ver registros de recepción de productos
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Ver cuenta corriente del proveedor"
          onClick={handleRedirectAccount}
        >
          <i className="bi bi-wallet2 me-2 fs-56"></i>
          Ir a cuenta corriente del proveedor
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
          disabled={status === "ANULADA" || isFullyStocked}
          hidden={status === "ANULADA" || isFullyStocked}
        >
          <i className="bi bi-x-circle-fill me-2 fs-6"></i>
          Anular compra
        </button>
      </div>
    </div>
  );
};
