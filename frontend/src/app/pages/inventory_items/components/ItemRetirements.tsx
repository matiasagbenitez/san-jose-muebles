import { RetirementsData as Data } from "../interfaces";
import { DayJsAdapter } from "../../../../helpers";
import { Table } from "react-bootstrap";

interface Props {
  retirements: Data[];
}

export const ItemRetirements = ({ retirements }: Props) => {
  return (
    <>
      <p className="mb-2 text-muted">Historial de bajas del artículo</p>
      {retirements.length > 0 ? (
        <Table responsive bordered size="sm" className="small">
          <thead>
            <tr className="text-uppercase text-center">
              <th>ID</th>
              <th>Fecha</th>
              <th>Motivo/razón</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            {retirements.map((retirement) => (
              <tr key={retirement.id} className="text-center">
                <td className="px-3">{retirement.id}</td>
                <td className="col-3">
                  {DayJsAdapter.toDayMonthYearHour(retirement.retired_at)}
                </td>
                <td className="col-6 text-start px-2">{retirement.reason}</td>
                <td className="col-3">{retirement.retired_by}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-muted small">
          No hay bajas registradas para este artículo
        </p>
      )}
    </>
  );
};
