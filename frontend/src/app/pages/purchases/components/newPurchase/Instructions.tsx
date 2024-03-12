export const Instructions = () => {
  return (
    <div className="text-muted small">
      {/* <b>Instrucciones para registrar una compra:</b> */}
      <hr />
      <p>Para registrar una compra, siga las instrucciones:</p>
      <ul>
        <li>
          Indique la <b>fecha</b> en la que se realizó la compra.
        </li>
        <li>
          Seleccione el <b>proveedor</b> al que le está comprando.
        </li>
        <li>
          Indique la <b>moneda</b> en la que se realizó la compra (en esta misma
          moneda se manejará la cuenta a pagar al proveedor).
        </li>

        <li>
          <b>Detalle de la compra: </b>
          por cada producto que compró, agréguelo al detalle con el botón{" "}
          <b>Agregar producto</b> y complete los siguientes datos:
          <ul>
            <li>
              <b>Cantidad: </b> cantidad comprada del producto.
            </li>
            <li>
              <b>Producto: </b> producto comprado.
            </li>
            <li>
              <b>Precio: </b> precio unitario del producto.
            </li>
          </ul>
        </li>
        <li>
          El <b>subtotal </b> de cada ítem se calculará de manera automática en
          base a la cantidad y el precio.
        </li>
        <li>
          Indique el <b>descuento</b> que se aplicó (si lo hubo). Esto ayuda a
          determinar el costo real de los productos. Si no hay descuento, deje
          el campo en 0.
        </li>
        <li>
          Indique el costo del <b>envío (flete)</b> si corresponde o bien, deje
          el campo en 0.
        </li>
        <li>
          Indique los <b>impuestos adicionales</b> que se aplicaron a la compra
          (si los hubo) o bien, deje el campo en 0.
        </li>
        <li>
          El <b>total</b> de la compra se calculará de manera automática en base
          al subtotal, descuento, envío e impuestos adicionales.
        </li>
        <li>
          Haga click en <b>Guardar</b> para registrar la compra.
        </li>
      </ul>
    </div>
  );
};
