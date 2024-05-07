import { Table } from "react-bootstrap";
import { ResumeInterface } from "../interfaces";
import { DayJsAdapter, toMoney } from "../../../../helpers";

interface Props {
  resume: ResumeInterface;
}

export const PurchaseData = ({ resume }: Props) => {
  return (
    <>
      <Table size="sm" className="small" striped bordered responsive>
        <tbody className="text-uppercase">
          <tr className="text-center fw-bold">
            <th colSpan={2}>Resumen de la compra</th>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Fecha compra
            </th>
            <td className="text-end px-2">
              {DayJsAdapter.toDayMonthYear(resume.date)}
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Proveedor
            </th>
            <td className="text-end px-2">
              <a
                href={`/proveedores/${resume.supplier.id}`}
                target="_blank"
                title="Ver proveedor"
              >
                <i className="bi bi-box-arrow-up-right me-2"></i>
                {resume.supplier.name} ({resume.supplier.locality})
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Moneda compra
            </th>
            <td className="text-end px-2">{resume.currency}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Importe compra
            </th>
            <td className="text-end px-2">
              {resume.is_monetary && "$"}
              {toMoney(resume.total)}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <small className="text-muted px-2 fst-italic">
                Compra registrada el{" "}
                {DayJsAdapter.toDayMonthYearHour(resume.created_at)} por{" "}
                {resume.created_by}
              </small>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
