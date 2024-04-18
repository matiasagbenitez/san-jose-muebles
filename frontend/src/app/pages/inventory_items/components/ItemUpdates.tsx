import { UpdatesData as Data } from "../interfaces";
import { DayJsAdapter } from "../../../../helpers";
import { Table } from "react-bootstrap";

interface Props {
  updates: Data[];
}

export const ItemUpdates = ({ updates }: Props) => {
  return (
    <>
      
      <p className="mb-2 text-muted small fw-bold">Historial de actualizaciones de cantidad del artículo</p>
      {updates.length > 0 ? (
        <Table responsive bordered size="sm" className="small">
          <thead>
            <tr className="text-uppercase text-center">
              <th>ID</th>
              <th>Fecha</th>
              <th>Cantidad antes</th>
              <th>Cantidad después</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            {updates.map((update) => (
              <tr key={update.id} className="text-center">
                <td className="px-3">{update.id}</td>
                <td className="col-3">
                  {DayJsAdapter.toDayMonthYearHour(update.updated_at)}
                </td>
                <td className="col-3">{update.prev_quantity}</td>
                <td className="col-3">{update.new_quantity}</td>
                <td className="col-3">{update.updated_by}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-muted small">No hay actualizaciones de cantidad registradas para este artículo</p>
      )}
    </>
  );
};
