import { Table } from "react-bootstrap";
import { toMoney } from "../../../../helpers";

export const ProductInfo = ({ product }: any) => {
  const low_stock =
    product.actual_stock + product.inc_stock <= product.min_stock;
  const bg_color = "rgba(255, 0, 0, 0.2)";

  return (
    <>
      <Table size="sm" className="small" striped bordered responsive>
        <tbody className="text-uppercase">
          <tr className="text-center fw-bold text-uppercase">
            <td colSpan={2}>Información del producto</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 col-2">
              Categoría
            </th>
            <td>{product.category}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Marca
            </th>
            <td>{product.brand}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Nombre
            </th>
            <td>{product.name}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Código
            </th>
            <td>{product.code}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Descripción
            </th>
            <td>
              <div className="text-break">
                <small>{product.description}</small>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>

      {/* INFORMACIÓN DE STOCK */}
      <Table size="sm" className="small" striped bordered responsive>
        <tbody>
          <tr className="text-center fw-bold text-uppercase">
            <td colSpan={12}>Información de stock</td>
          </tr>

          <tr className="text-center text-uppercase">
            <th className="px-2 col-2">Unidad medida</th>
            <th className="px-2 col-2">
              Stock actual
            </th>
            <th className="px-2 col-2">
              Stock a recibir
            </th>
            <th className="px-2 col-2">
              Stock total
            </th>
            <th className="px-2 col-2">
              Stock mínimo
            </th>
            <th className="px-2 col-2">
              Stock ideal
            </th>
          </tr>
          <tr className="text-center">
            <td>
              {product.unit} ({product.unit_symbol})
            </td>
            <td>
              {product.actual_stock} {product.unit_symbol}
            </td>
            <td>
              {product.inc_stock} {product.unit_symbol}
            </td>
            <td
              className="fw-bold"
              style={{ backgroundColor: low_stock ? bg_color : "" }}
            >
              {product.actual_stock + product.inc_stock} {product.unit_symbol}
              {low_stock && (
                <i
                  className="bi bi-exclamation-triangle-fill text-danger ms-2"
                  title="Stock bajo (por debajo del mínimo)"
                ></i>
              )}
            </td>
            <td>
              {product.min_stock} {product.unit_symbol}
            </td>
            <td>
              {product.ideal_stock} {product.unit_symbol}
            </td>
          </tr>
        </tbody>
      </Table>

      {/* INFORMACIÓN DE COMPRA */}
      <Table size="sm" className="small" striped bordered responsive>
        <tbody>
          <tr className="text-center fw-bold text-uppercase">
            <td colSpan={8}>Información de compra</td>
          </tr>

          <tr className="text-center text-uppercase">
            <th className="px-2 col-2" colSpan={1}>
              Moneda compra
            </th>
            <th className="px-2 col-2" colSpan={1}>
              Último precio
            </th>
            <th className="px-2 col-2" colSpan={1}>
              Capital actual
            </th>
            <th className="px-2 col-2" colSpan={1}>
              Capital total
            </th>
          </tr>
          <tr className="text-center">
            <td colSpan={1}>
              {product.currency} ({product.currency_symbol})
            </td>
            <td colSpan={1}>
              {product.currency_symbol} {product.price_monetary && " $"}
              {toMoney(product.last_price)} x {product.unit}
            </td>
            <td colSpan={1}>
              {product.currency_symbol} {product.price_monetary && " $"}
              {toMoney(product.stock_value)}
            </td>
            <td className="fw-bold" colSpan={1}>
              {product.currency_symbol} {product.price_monetary && " $"}
              {toMoney(
                (product.actual_stock + product.inc_stock) * product.last_price
              )}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
