import { Badge, Table } from "react-bootstrap";
import { VisitRequestInterface } from "../interfaces";
import { DayJsAdapter } from "../../../../helpers";

interface Props {
  visit: VisitRequestInterface;
}

export const VisitRequestInfo = ({ visit }: Props) => {
  return (
    <>
      <Table size="sm" className="small" striped bordered responsive>
        <tbody>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-3">
              Cliente
            </th>
            <td>
              {visit.client.name} ({visit.client.locality})
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-3">
              Teléfono
            </th>
            <td>{visit.client.phone}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-3">
              Lugar visita
            </th>
            <td>{visit.locality}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-3">
              Dirección
            </th>
            <td>{visit.address || "No especificada"}</td>
          </tr>
        </tbody>
      </Table>
      <Table size="sm" className="small" striped bordered responsive>
        <tbody>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-3">
              Estado
            </th>
            <td>
              <span
                style={{ fontSize: ".85em" }}
                className={`badge ${
                  visit.status === "PENDIENTE"
                    ? "bg-warning"
                    : visit.status === "REALIZADA"
                    ? "bg-success"
                    : "bg-danger"
                }`}
              >
                {visit.status}
              </span>
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-3">
              Prioridad
            </th>
            <td>
              <span
                style={{ fontSize: ".85em" }}
                className={`badge ${
                  visit.priority === "BAJA"
                    ? "bg-secondary"
                    : visit.priority === "MEDIA"
                    ? "bg-primary"
                    : visit.priority === "ALTA"
                    ? "bg-warning"
                    : "bg-danger"
                }`}
              >
                {visit.priority}
              </span>
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-3">
              Motivo visita
            </th>
            <td>{visit.reason}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-3">
              Título
            </th>
            <td>{visit.title}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-3">
              Descripción
            </th>
            <td>
              <div className="text-break">
                {visit.description || "No especificada"}
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-3">
              Fecha programada
            </th>
            <td>
              <span>
                {DayJsAdapter.toDayMonthYearHour(visit.start)} -{" "}
                {DayJsAdapter.toDayMonthYearHour(visit.end)}
              </span>
              {visit.overdue && (
                <Badge
                  bg="danger"
                  className="ms-2"
                  style={{ fontSize: ".85em" }}
                >
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>
                  La fecha programada ya pasó
                </Badge>
              )}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
