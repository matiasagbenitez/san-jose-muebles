import { Dropdown, Row, Table } from "react-bootstrap";
import { ProjectDetailInterface, ProjectStatuses } from "../interfaces";
import { DateFormatter } from "../../../helpers";
import { Link } from "react-router-dom";
import { DesignStatusBadge, StatusBadge } from "../../environments/components";
import { DesignStatus, Status } from "../../environments/interfaces";
import { ReasonModal } from ".";
import { useState } from "react";
import { SweetAlert2 } from "../../../utils";
import apiSJM from "../../../../api/apiSJM";

interface Props {
  project: ProjectDetailInterface;
}

export const Data = ({ project }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<Status>(project.status);
  const [newStatus, setNewStatus] = useState<Status | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleRedirectWhatsapp = () => {
    const formatedPhone = project.client_phone.replace(/[-\s]/g, "");
    window.open(`https://api.whatsapp.com/send?phone=54${formatedPhone}`);
  };

  const submitForm = async (reason: string) => {

    const message = `¿Desea cambiar el estado del proyecto a ${newStatus}?`;
    const confirmation = await SweetAlert2.confirm(message);
    if (!confirmation.isConfirmed) return;

    try {
      setIsFormSubmitted(true);
      const { data } = await apiSJM.patch(`/projects/${project.id}/status`, {
        status: newStatus,
        reason,
      });
      if (data.ok) setStatus(data.status);
      SweetAlert2.successToast("¡Estado actualizado correctamente!");
      setShowModal(false);
    } catch (error) {
      console.log(error);
      SweetAlert2.errorAlert("¡No se pudo actualizar el estado del proyecto!");
    } finally {
      setIsFormSubmitted(false);
    }
  };

  const openModal = (status: Status) => {
    setNewStatus(status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  }

  return (
    <>
      <Row
        xs={1}
        xl={2}
        className="mb-3 fst-normal small bg-light px-2 py-3 rounded rounded-3 mx-0"
      >
        <p className="mb-2">
          <i className="bi bi-person me-2 fst-normal fw-bold" />
          <b>CLIENTE: </b>
          <Link
            to={`/clientes/${project.id_client}`}
            target="_blank"
            title="Ver cliente"
          >
            {project.client}
          </Link>
          <i className="text-muted">
            {project.client_phone && (
              <>
                <button
                  className="btn btn-link p-0 btn-sm text-decoration-none"
                  title="Ir a WhatsApp"
                  onClick={handleRedirectWhatsapp}
                >
                  <i className="bi bi-whatsapp ms-2 text-success">
                    <span className="ms-1">Enviar un WhatsApp</span>
                  </i>
                </button>
              </>
            )}
          </i>
        </p>
        <p className="mb-2">
          <i className="bi bi-houses me-2 fst-normal fw-bold" />
          <b>PROYECTO: </b>
          {project.title}
        </p>
        <p className="mb-2">
          <i className="bi bi-geo-alt me-2 fst-normal fw-bold" />
          <b>DIRECCIÓN: </b>
          {project.address && project.address + " - "} {project.locality}
        </p>
        <span className="mb-2 d-flex align-items-center">
          <i className="bi bi-info-circle me-2" />
          <b>ESTADO GENERAL DEL PROYECTO: </b>
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              size="sm"
              variant="transparent"
              className="my-0 mx-1 py-0 px-2 rounded"
            >
              <span className="fw-bold me-1">
                <i className={`${ProjectStatuses[status].icon} me-1`}></i>
                {ProjectStatuses[status].text}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.ItemText className="small fw-bold">
                Actualizar estado
              </Dropdown.ItemText>
              <Dropdown.Divider className="my-1" />
              {Object.entries(ProjectStatuses).map(
                ([status, { text, icon }]) => (
                  <Dropdown.Item
                    className="small"
                    key={status}
                    onClick={() => openModal(status as Status)}
                  >
                    <i className={`${icon}`}></i>
                    {text}
                  </Dropdown.Item>
                )
              )}
            </Dropdown.Menu>
          </Dropdown>
        </span>
        <p className="mb-2 mb-xl-0">
          <i className="bi bi-calendar me-2 fst-normal fw-bold" />
          <b>FECHA ENTREGA SOLICITADA: </b>
          {project.requested_deadline
            ? DateFormatter.toWDMYText(project.requested_deadline)
            : "No especificada"}
        </p>
        <p className="mb-2 mb-xl-0">
          <i className="bi bi-calendar-check me-2 fst-normal fw-bold" />
          <b>FECHA ENTREGA ESTIMADA: </b>
          {project.estimated_deadline
            ? DateFormatter.toWDMYText(project.estimated_deadline)
            : "No especificada"}
        </p>
      </Row>

      <ReasonModal
        newStatus={newStatus}
        showModal={showModal}
        handleSubmit={submitForm}
        hideModal={closeModal}
        isFormSubmitted={isFormSubmitted}
      />

      <h6>Listado de ambientes del proyecto</h6>
      {project.environments.length <= 0 ? (
        <p className="text-muted fst-italic">
          El proyecto no tiene ambientes asociados. Registre un nuevo ambiente.
        </p>
      ) : (
        <Table responsive size="sm" className="small align-middle">
          <thead>
            <tr className="text-center text-uppercase">
              <th style={{ backgroundColor: "#F2F2F2" }} className="px-4">
                ID
              </th>
              <th style={{ backgroundColor: "#F2F2F2" }} className="col-3">
                Ambiente
              </th>
              <th style={{ backgroundColor: "#F2F2F2" }} className="col-3">
                Estado diseño
              </th>
              <th style={{ backgroundColor: "#F2F2F2" }} className="col-3">
                Estado fabricación
              </th>
              <th style={{ backgroundColor: "#F2F2F2" }} className="col-3">
                Estado instalación
              </th>
              <th style={{ backgroundColor: "#F2F2F2" }} className="px-4">
                DETALLE
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
        {DateFormatter.toDMYHText(project.createdAt)}
      </p>
    </>
  );
};
