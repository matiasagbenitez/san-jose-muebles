import { Table } from "react-bootstrap";
import { ProductPendingReception } from "../interfaces";
import { DayJsAdapter } from "../../../../helpers";

interface ProductPendingProps {
  pendingReceptions: ProductPendingReception[];
}

export const ProductPending = ({ pendingReceptions }: ProductPendingProps) => {
  return (
    <div className="mt-3">
      <h5 className="fs-6">Recepciones pendientes</h5>

      <Table size="sm" className="small" striped bordered responsive>
        <thead>
          <tr className="text-center fw-bold text-uppercase">
            <td className="col-2">Fecha compra</td>
            <td className="col-6">Proveedor</td>
            <td className="col-2">Stock pendiente</td>
            <td className="col-2">Detalle</td>
          </tr>
        </thead>
        <tbody>
          {pendingReceptions.map((item: ProductPendingReception) => (
            <tr key={item.id}>
              <td className="text-center">{DayJsAdapter.toDayMonthYear(item.date)}</td>
              <td>{item.supplier}</td>
              <td className="text-center">{item.pending_stock}</td>
              <td className="text-center">
                <a
                  href={`/compras/${item.id_purchase}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver compra
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
