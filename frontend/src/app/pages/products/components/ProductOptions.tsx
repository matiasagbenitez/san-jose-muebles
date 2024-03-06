export const ProductOptions = () => {
  return (
    <div>
      <h2 className="fs-6">Menú de opciones</h2>
      <div className="list-group small">
        <button
          className="list-group-item list-group-item-action py-1"
          title="Modificar información del producto"
        >
          <i className="bi bi-pencil me-2 fs-6"></i>
          Modificar información del producto
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Modificar stock del producto"
        >
          <i className="bi bi-plus-slash-minus me-2 fs-6"></i>
          Modificar stock del producto
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Modificar costo del producto"
        >
          <i className="bi bi-currency-dollar me-2 fs-6"></i>
          Modificar costo del producto
        </button>
        <button
          className="list-group-item list-group-item-action py-1 text-danger"
          title="Eliminar producto"
        >
          <i className="bi bi-trash me-2 fs-6"></i>
          Eliminar producto
        </button>
      </div>
    </div>
  );
};
