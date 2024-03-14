export const PurchaseOptions = () => {
  return (
    <div className="mb-4">
      <h2 className="fs-6 mt-2">Menú de opciones</h2>
      <div className="list-group small">
      <button
          className="list-group-item list-group-item-action py-1"
          title="Cuentas bancarias del proveedor"
        >
          <i className="bi bi-bank me-2 fs-6"></i>
          Cuentas bancarias del proveedor
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Gestionar pagos realizados"
        >
          <i className="bi bi-cash-stack me-2 fs-6"></i>
          Gestionar pagos realizados
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Marcar todos los productos como recibidos"
        >
          <i className="bi bi-check2-square me-2 fs-56"></i>
          Marcar todos los productos como recibidos
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
        >
          <i className="bi bi-x-circle-fill me-2 fs-6"></i>
          Anular compra
        </button>
      </div>
    </div>
  );
};
