import { Table } from "react-bootstrap";
import { ResumeInterface } from "../interfaces";
import { DayJsAdapter, toMoney } from "../../../../helpers";

export const PurchaseData = ({ data }: { data: ResumeInterface }) => {
  const {
    date,
    supplier,
    currency,
    is_monetary,
    total,
    created_at,
    created_by,
  } = data;

  return (
    <>
      <Table size="sm" className="small" striped bordered responsive>
        <tbody>
          <tr className="text-center fw-bold text-uppercase">
            <th colSpan={2}>Resumen de la compra</th>
          </tr>
          <tr>
            <th scope="row" className="text-uppercase">Fecha compra</th>
            <td className="text-end">{DayJsAdapter.toDayMonthYear(date)}</td>
          </tr>
          <tr>
            <th scope="row" className="text-uppercase">Proveedor</th>
            <td className="text-end">
              <a href={`/proveedores/${supplier.id}`} target="_blank" title="Ver proveedor">
                <i className="bi bi-box-arrow-up-right me-2"></i>
                {supplier.name} ({supplier.locality})
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row" className="text-uppercase">Moneda compra</th>
            <td className="text-end">{currency}</td>
          </tr>
          <tr>
            <th scope="row" className="text-uppercase">Importe compra</th>
            <td className="text-end">
              {is_monetary && "$"}
              {toMoney(total)}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <small className="text-muted">
                Compra registrada el{" "}
                {DayJsAdapter.toDayMonthYearHour(created_at)} por {created_by}
              </small>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
