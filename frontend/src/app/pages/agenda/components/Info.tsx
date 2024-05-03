import { Badge, ListGroup, Table } from "react-bootstrap";
import {
  VisitRequestInterface,
  VisitStatuses,
  VisitPriorities,
} from "../interfaces";
import { DayJsAdapter } from "../../../../helpers";

interface Props {
  visit: VisitRequestInterface;
}

export const VisitRequestInfo = ({ visit }: Props) => {
  return (
    <>
      <Table size="sm" className="small mb-2" striped bordered responsive>
        <tbody className="text-uppercase">
          <tr>
            <th scope="row" className="px-2 col-3">
              Fecha programada
            </th>
            <td className="px-2">
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
                <span
                  className="badge rounded-pill bg-danger float-end"
                  style={{ fontSize: ".8em" }}
                >
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>
                  La fecha programada ya pasó
                </span>
              )}
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Cliente a visitar
            </th>
            <td className="px-2">
              {visit.client.name} ({visit.client.locality}
              <span className="text-muted">, Tel: {visit.client.phone}</span>)
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Lugar a visitar
            </th>
            <td className="px-2">{visit.locality}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Dirección
            </th>
            <td className="px-2">{visit.address || ""}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase">
              Motivo de la visita
            </th>
            <td className="px-2">{visit.reason}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Estado de la visita
            </th>
            <td className="px-2">
              <span
                className="badge rounded-pill"
                style={{
                  fontSize: ".85em",
                  color: "black",
                  backgroundColor: VisitStatuses[visit.status] || "gray",
                }}
              >
                {visit.status}
              </span>
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase">
              Prioridad
            </th>
            <td className="px-2">
              <span
                className="badge rounded-pill"
                style={{
                  fontSize: ".85em",
                  color: "black",
                  backgroundColor: VisitPriorities[visit.priority] || "gray",
                }}
              >
                {visit.priority}
              </span>
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Notas adicionales
            </th>
            <td className="px-2">{visit.notes || ""}</td>
          </tr>
        </tbody>
      </Table>

      <small className="text-muted fst-italic">
        Solicitud de visita registrada por {visit.createdBy} (
        {DayJsAdapter.toDayMonthYearHour(visit.createdAt)})
      </small>

      <h6 className="my-3">
        Registro de cambios de estado
        <span className="small mx-1 fw-normal fst-italic">
          (más recientes primero)
        </span>
      </h6>

      {visit.evolutions.length === 0 ? (
        <p className="text-muted fst-italic small">
          No se han registrado cambios de estado
        </p>
      ) : (
        <ListGroup className="small">
          {visit.evolutions.map((evolution) => (
            <ListGroup.Item key={evolution.id}>
              {evolution.user} marcó la visita como <b>{evolution.status}</b> el
              día {DayJsAdapter.toDayMonthYearHour(evolution.createdAt)}.{" "}
              {evolution.comment && (
                <span className="text-muted fst-italic">
                  Comentario: {evolution.comment}
                </span>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
};
