import { Badge, Table } from "react-bootstrap";
import { VisitRequestInterface } from "../interfaces";
import { DayJsAdapter } from "../../../../helpers";

enum Priority {
  BAJA = "#B5D6A7",
  MEDIA = "#FFF47A",
  ALTA = "#FD9800",
  URGENTE = "#F55D1E",
}

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
              Lugar a visitar
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
                style={{ fontSize: ".85em", color: "black" }}
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
                style={{
                  fontSize: ".85em",
                  color: "black",
                  backgroundColor:
                    Priority[visit.priority as keyof typeof Priority],
                }}
                className="badge"
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
              Notas adicionales
            </th>
            <td>
              <div className="text-break">{visit.notes || ""}</div>
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-3">
              Fecha programada
            </th>
            <td>
              <span>
                {visit.schedule === "NOT_SCHEDULED" && "No programada"}
                {visit.schedule === "PARTIAL_SCHEDULED" && (
                  <>{DayJsAdapter.toDateString(visit.start as Date)} </>
                )}
                {visit.schedule === "FULL_SCHEDULED" && (
                  <>{DayJsAdapter.toDatetimeString(visit.start as Date)} </>
                )}
              </span>
              {visit.overdue && (
                <Badge
                  bg="danger"
                  className="float-end"
                  style={{ fontSize: ".85em" }}
                >
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>
                  La fecha programada ya pasó
                </Badge>
              )}
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-3">
              Creado por
            </th>
            <td className="text-muted fst-italic">
              {visit.createdBy} (
              {DayJsAdapter.toDayMonthYearHour(visit.createdAt)})
            </td>
          </tr>
        </tbody>
      </Table>

      <h6>Registro de cambios de estado</h6>
      {visit.evolutions.length === 0 ? (
        <p className="text-muted fst-italic small">
          No se han registrado cambios de estado
        </p>
      ) : (
        <ul className="small">
          {visit.evolutions.map((evolution, index) => (
            <li
              key={evolution.id}
              className={index === visit.evolutions.length - 1 ? "fw-bold" : ""}
            >
              {evolution.user} marcó la visita como {evolution.status} el día{" "}
              {DayJsAdapter.toDayMonthYearHour(evolution.createdAt)}.
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
