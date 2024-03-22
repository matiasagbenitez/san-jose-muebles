import { Table } from "react-bootstrap";
import { toMoney } from "../../../../helpers";

export const ProductInfo = ({ product }: any) => {
  const low_stock = product.actual_stock <= product.min_stock;
  const bg_color = "rgba(255, 0, 0, 0.2)";
  return (
    <>
      <Table size="sm" className="small" striped bordered responsive>
        <tbody>
          <tr className="text-center fw-bold text-uppercase">
            <td colSpan={2}>Información del producto</td>
          </tr>
          <tr>
            <th scope="row">Categoría</th>
            <td>{product.category}</td>
          </tr>
          <tr>
            <th scope="row">Marca</th>
            <td>{product.brand}</td>
          </tr>
          <tr>
            <th scope="row" className="col-3">
              Nombre
            </th>
            <td>{product.name}</td>
          </tr>
          <tr>
            <th scope="row">Código</th>
            <td>{product.code}</td>
          </tr>
          <tr>
            <th scope="row">Descripción</th>
            <td>
              <div className="text-break">
                <small>{product.description}</small>
              </div>
            </td>
          </tr>
          <tr className="text-center fw-bold text-uppercase">
            <td colSpan={2}>Información de stock</td>
          </tr>
          <tr>
            <th scope="row">Unidad</th>
            <td>{product.unit}</td>
          </tr>
          <tr
            title={
              low_stock
                ? `Nivel de stock por debajo del mínimo (${product.min_stock})`
                : ""
            }
          >
            <th
              scope="row"
              style={{
                backgroundColor: low_stock ? bg_color : "transparent",
                // color: low_stock ? "red" : "black",
              }}
            >
              Stock actual
            </th>
            <td
              style={{
                backgroundColor: low_stock ? bg_color : "transparent",
                color: low_stock ? "red" : "black",
                fontWeight: "bold",
              }}
            >
              {product.actual_stock} {product.unit_symbol}
              {low_stock ? (
                <i className="bi bi-exclamation-triangle ms-2"></i>
              ) : (
                ""
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Stock a recibir</th>
            <td>
              {product.inc_stock} {product.unit_symbol}
            </td>
          </tr>
          <tr>
            <th scope="row">Stock total</th>
            <td>
              {product.actual_stock + product.inc_stock} {product.unit_symbol}
            </td>
          </tr>
          <tr>
            <th scope="row">Stock mínimo</th>
            <td>
              {product.min_stock} {product.unit_symbol}
            </td>
          </tr>
          <tr>
            <th scope="row">Stock ideal</th>
            <td>
              {product.ideal_stock} {product.unit_symbol}
            </td>
          </tr>
          <tr className="text-center fw-bold text-uppercase">
            <td colSpan={2}>Información de compra</td>
          </tr>
          <tr>
            <th scope="row">Moneda de compra</th>
            <td>
              {product.currency_symbol} ({product.currency})
            </td>
          </tr>
          <tr>
            <th scope="row">Último precio pagado</th>
            <td>
              {product.currency_symbol}
              {product.price_monetary && " $ "}
              {toMoney(product.last_price)} x {product.unit}
            </td>
          </tr>
          <tr>
            <th scope="row">Capital actual en fábrica</th>
            <td>
              {product.currency_symbol}
              {product.price_monetary && " $ "}
              {toMoney(product.stock_value)}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
