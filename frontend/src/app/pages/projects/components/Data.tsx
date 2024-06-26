import { Card, Col, Dropdown, Row } from "react-bootstrap";
import { ProjectDetailInterface, ProjectStatuses } from "../interfaces";
import { DateFormatter } from "../../../helpers";
import { Link, useNavigate } from "react-router-dom";
import { Status } from "../../environments/interfaces";
import { ReasonModal } from ".";
import { useState } from "react";
import { SweetAlert2 } from "../../../utils";
import apiSJM from "../../../../api/apiSJM";
import { DesignStatusSpan } from "../../design/components";

interface Props {
  project: ProjectDetailInterface;
}

export const Data = ({ project }: Props) => {
  const navigate = useNavigate();
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
  };

  const redirectHistorial = () => {
    navigate(`/proyectos/${project.id}/historial`);
  };

  return (
    <>
      <Row
        xs={1}
        xl={2}
        className="mb-3 fst-normal small bg-light px-2 py-3 rounded rounded-3 mx-0 border"
      >
        <p className="mb-2" title="Cliente">
          <i className="bi bi-person me-2 fst-normal fw-bold" />
          <b>{project.client}</b>
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
        </p>
        <p className="mb-2" title="Proyecto">
          <i className="bi bi-houses me-2 fst-normal fw-bold" />
          <b>PROYECTO {project.title}</b>
        </p>
        <p className="mb-2" title="Dirección">
          <i className="bi bi-geo-alt me-2 fst-normal fw-bold" />
          {project.address && project.address + " - "}
          {project.locality}
        </p>
        <Dropdown title="Estado actual del proyecto">
          <Dropdown.Toggle
            id="dropdown-basic"
            size="sm"
            variant="transparent"
            className="mb-2 p-0 rounded border-0"
          >
            <span className="fw-bold me-1">
              <i className={`${ProjectStatuses[status].icon} me-1`}></i>
              PROYECTO {ProjectStatuses[status].text}
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.ItemText className="small fw-bold">
              Actualizar estado
            </Dropdown.ItemText>
            <Dropdown.Divider className="my-1" />
            {Object.entries(ProjectStatuses).map(([status, { text, icon }]) => (
              <div key={status}>
                {status !== project.status && (
                  <Dropdown.Item
                    className="small"
                    key={status}
                    onClick={() => openModal(status as Status)}
                  >
                    <i className={`${icon}`}></i>
                    {text}
                  </Dropdown.Item>
                )}
              </div>
            ))}
            <Dropdown.Divider className="my-1" />
            <Dropdown.Item
              className="small"
              key={status}
              onClick={redirectHistorial}
            >
              <i className="me-1 bi bi-clock-history"></i> Ver historial
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <p className="mb-2 mb-xl-0">
          <i className="bi bi-calendar me-2 fst-normal fw-bold" />
          Fecha entrega solicitada:{" "}
          {project.requested_deadline
            ? DateFormatter.toWDMYText(project.requested_deadline)
            : "no especificada"}
        </p>
        <p className="mb-2 mb-xl-0">
          <i className="bi bi-calendar-check me-2 fst-normal fw-bold" />
          Fecha entrega estimada:{" "}
          {project.estimated_deadline
            ? DateFormatter.toWDMYText(project.estimated_deadline)
            : "no especificada"}
        </p>
      </Row>

      <ReasonModal
        newStatus={newStatus}
        showModal={showModal}
        handleSubmit={submitForm}
        hideModal={closeModal}
        isFormSubmitted={isFormSubmitted}
      />

      <h6 className="mt-4 mb-3">Listado de ambientes del proyecto</h6>
      {project.environments.length <= 0 ? (
        <p className="text-muted fst-italic">
          El proyecto no tiene ambientes asociados. Registre un nuevo ambiente.
        </p>
      ) : (
        <>
          {project.environments.map((env, index) => (
            <Link
              title="Ver detalle del ambiente"
              to={`/proyectos/${project.id}/ambientes/${env.id}`}
              key={index}
              className="text-decoration-none small"
            >
              <Card className="mb-3">
                <Card.Header>
                  <b>
                    AMBIENTE N° {env.id} — {env.type}
                  </b>
                </Card.Header>
                <Card.Body className="py-2">
                  <Row>
                    <Col xs={12} xl={4} className="mb-2 mb-xl-0">
                      <b className="me-2 text-muted">DISEÑO:</b>
                      <DesignStatusSpan status={env.des_status} />
                    </Col>
                    <Col xs={12} xl={4} className="mb-2 mb-xl-0">
                      <b className="me-2 text-muted">FABRICACIÓN:</b>
                      {env.fab_status}
                    </Col>
                    <Col xs={12} xl={4} className="mb-2 mb-xl-0">
                      <b className="me-2 text-muted">INSTALACIÓN:</b>
                      {env.ins_status}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Link>
          ))}
        </>
      )}
    </>
  );
};
