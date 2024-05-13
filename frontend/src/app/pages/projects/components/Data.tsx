import { Table } from "react-bootstrap";
import { ProjectDetailInterface, Priorities, Statuses } from "../interfaces";
import { DateFormatter } from "../../../helpers";

interface Props {
  project: ProjectDetailInterface;
}

export const Data = ({ project }: Props) => {
  const handleRedirectWhatsapp = () => {
    const formatedPhone = project.client_phone.replace(/[-\s]/g, "");
    window.open(`https://api.whatsapp.com/send?phone=54${formatedPhone}`);
  };

  return (
    <>
      <Table size="sm" className="small" striped bordered responsive>
        <tbody className="text-uppercase align-middle">
          <tr>
            <th scope="row" className="px-2 col-4">
              Cliente
            </th>
            <td className="px-2">
              <a
                href={`/clientes/${project.id_client}`}
                target="_blank"
                title="Ver cliente"
              >
                <i className="bi bi-box-arrow-up-right me-2"></i>
                {project.client}
              </a>{" "}
              <i className="text-muted">
                {project.client_phone && (
                  <>
                    (Tel: {project.client_phone})
                    <button
                      className="btn btn-link p-0 btn-sm text-decoration-none"
                      title="Ir a WhatsApp"
                      onClick={handleRedirectWhatsapp}
                    >
                      <i className="bi bi-whatsapp ms-2 text-success">
                        <span className="ms-2">Enviar un WhatsApp</span>
                      </i>
                    </button>
                  </>
                )}
              </i>
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Título proyecto
            </th>
            <td className="px-2">{project.title}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Localidad del proyecto
            </th>
            <td className="px-2">{project.locality}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Dirección del proyecto
            </th>
            <td className="px-2">{project.address}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Estado actual
            </th>
            <td className="px-2">
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
            <th scope="row" className="px-2">
              Prioridad
            </th>
            <td className="px-2">
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
            <th scope="row" className="px-2">
              Fecha de entrega solicitada
            </th>
            <td className="px-2">
              {project.requested_deadline
                ? DateFormatter.toWDMYText(project.requested_deadline)
                : "No especificada"}
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Fecha de entrega estimada
            </th>
            <td className="px-2">
              {project.estimated_deadline
                ? DateFormatter.toWDMYText(project.estimated_deadline)
                : "No especificada"}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <small className="text-muted px-2 fst-italic">
                Proyecto registrado en el sistema el{" "}
                {DateFormatter.toDMYText(project.createdAt)}
              </small>
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
            <td className="px-2">
              {project.env_des} / {project.env_total}
            </td>
            <td className="px-2">
              {project.env_fab} / {project.env_total}
            </td>
            <td className="px-2">
              {project.env_ins} / {project.env_total}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
