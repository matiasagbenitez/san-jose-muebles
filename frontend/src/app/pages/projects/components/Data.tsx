import { Table } from "react-bootstrap";
import { ProjectDetailInterface, Priorities, Statuses } from "../interfaces";
import { DayJsAdapter } from "../../../../helpers";

interface Props {
  project: ProjectDetailInterface;
}

export const Data = ({ project }: Props) => {
  return (
    <>
      <Table size="sm" className="small" striped bordered responsive>
        <tbody>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-4">
              Cliente
            </th>
            <td>
              {/* {project.client}{" "}
              <i className="text-muted">(Teléfono: {project.client_phone})</i> */}
              <a
                href={`/clientes/${project.id_client}`}
                target="_blank"
                title="Ver cliente"
              >
                <i className="bi bi-box-arrow-up-right me-2"></i>
                {project.client}
              </a>{" "}
              <i className="text-muted">(Teléfono: {project.client_phone})</i>
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-4">
              Proyecto
            </th>
            <td>{project.title}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-4">
              Localidad del proyecto
            </th>
            <td>{project.locality}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-4">
              Dirección del proyecto
            </th>
            <td>{project.address}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-4">
              Estado actual
            </th>
            <td>
              {" "}
              <span
                className="badge rounded-pill"
                style={{
                  fontSize: ".9em",
                  color: "black",
                  backgroundColor: Statuses[project.status] || "gray",
                }}
              >
                {project.status}
              </span>
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-4">
              Prioridad
            </th>
            <td>
              <span
                className="badge rounded-pill"
                style={{
                  fontSize: ".9em",
                  color: "black",
                  backgroundColor: Priorities[project.priority] || "gray",
                }}
              >
                {project.priority}
              </span>
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-4">
              Fecha de registro en el sistema
            </th>
            <td className="fst-italic text-muted">
              {DayJsAdapter.toDateYearString(project.createdAt)}
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-4">
              Fecha de entrega solicitada
            </th>
            <td>
              {project.requested_deadline
                ? DayJsAdapter.toDateYearString(project.requested_deadline)
                : "No especificada"}
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-4">
              Fecha de entrega estimada
            </th>
            <td>
              {project.estimated_deadline
                ? DayJsAdapter.toDateYearString(project.estimated_deadline)
                : "No especificada"}
            </td>
          </tr>
        </tbody>
      </Table>

      <Table size="sm" className="small" striped bordered responsive>
        <tbody>
          <tr className="text-center fw-bold text-uppercase">
            <td colSpan={6}>Estado de avance</td>
          </tr>

          <tr className="text-center text-uppercase">
            <th className="px-2 col-2">Ambientes diseñados</th>
            <th className="px-2 col-2">Ambientes fabricados</th>
            <th className="px-2 col-2">Ambientes instalados</th>
          </tr>
          <tr className="text-center">
            <td>
              {project.env_des} / {project.env_total}
            </td>
            <td>
              {project.env_fab} / {project.env_total}
            </td>
            <td>
              {project.env_ins} / {project.env_total}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
