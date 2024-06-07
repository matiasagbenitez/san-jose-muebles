import { Table } from "react-bootstrap";
import { ProjectDetailInterface, Priorities, Statuses } from "../interfaces";
import { DateFormatter } from "../../../helpers";
import { Link } from "react-router-dom";
import { DesignStatusBadge, StatusBadge } from "../../environments/components";
import { DesignStatus, Status } from "../../environments/interfaces";

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
      <p>
        Estado actual del proyecto:{" "}
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
      </p>
      <Table bordered responsive striped size="sm" className="small align-middle">
        <tbody className="text-uppercase">
          <tr>
            <th className="col-3 px-2">Cliente</th>
            <td className="col-9 px-2">
              <Link
                to={`/clientes/${project.id_client}`}
                target="_blank"
                title="Ver cliente"
              >
                {project.client}
              </Link>{" "}
              <i className="text-muted">
                {project.client_phone && (
                  <>
                    <button
                      className="btn btn-link p-0 btn-sm text-decoration-none"
                      title="Ir a WhatsApp"
                      onClick={handleRedirectWhatsapp}
                    >
                      <i className="bi bi-whatsapp ms-2 text-success">
                        <span className="ms-1">WhatsApp</span>
                      </i>
                    </button>
                  </>
                )}
              </i>
            </td>
          </tr>
          <tr>
            <th className="px-2">Proyecto</th>
            <td className="px-2 fw-bold">{project.title}</td>
          </tr>
          <tr>
            <th className="px-2">Localidad</th>
            <td className="px-2">{project.locality}</td>
          </tr>
          <tr>
            <th className="px-2">Dirección</th>
            <td className="px-2">{project.address}</td>
          </tr>
          <tr>
            <th className="px-2">Prioridad</th>
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
            <th className="px-2">Fecha entrega solicitada</th>
            <td className="px-2">
              {" "}
              {project.requested_deadline
                ? DateFormatter.toWDMYText(project.requested_deadline)
                : "No especificada"}
            </td>
          </tr>
          <tr>
            <th className="px-2">Fecha entrega estimada</th>
            <td className="px-2">
              {" "}
              {project.estimated_deadline
                ? DateFormatter.toWDMYText(project.estimated_deadline)
                : "No especificada"}
            </td>
          </tr>
        </tbody>
      </Table>

      <h6>Listado de ambientes del proyecto</h6>
      {project.environments.length <= 0 ? (
        <p className="text-muted fst-italic">
          El proyecto no tiene ambientes asociados. Registre un nuevo ambiente.
        </p>
      ) : (
        <Table responsive size="sm" className="small align-middle">
          <thead>
            <tr className="text-center text-uppercase">
              <th style={{ backgroundColor: "#F2F2F2" }} className="col-1">
                ID
              </th>
              <th style={{ backgroundColor: "#F2F2F2" }} className="col-4">
                Ambiente
              </th>
              <th style={{ backgroundColor: "#F2F2F2" }} className="col-2">
                Diseño
              </th>
              <th style={{ backgroundColor: "#F2F2F2" }} className="col-2">
                Fabricación
              </th>
              <th style={{ backgroundColor: "#F2F2F2" }} className="col-2">
                Instalación
              </th>
              <th style={{ backgroundColor: "#F2F2F2" }} className="col-1">
                Ver
              </th>
            </tr>
          </thead>

          {/* ITERAR */}
          <tbody className="text-uppercase">
            {project.environments.map((env, index) => (
              <tr key={index} className="text-center">
                <td>{env.id}</td>
                <td>{env.type}</td>
                <td>
                  <DesignStatusBadge status={env.des_status as DesignStatus} />
                </td>
                <td>
                  <StatusBadge status={env.fab_status as Status} />
                </td>
                <td>
                  <StatusBadge status={env.ins_status as Status} />
                </td>
                <td>
                  <Link
                    to={`/ambientes/${env.id}`}
                    className="btn btn-link p-0"
                  >
                    <i className="bi bi-eye-fill text-secondary"></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <p className="small text-muted">
        <i className="bi bi-info-circle me-2"></i>
        Proyecto registrado en el sistema el{" "}
        {DateFormatter.toDMYHText(project.createdAt)}.
      </p>
    </>
  );
};
