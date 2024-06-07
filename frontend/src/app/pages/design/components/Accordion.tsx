import { Fragment, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Dropdown,
  useAccordionButton,
} from "react-bootstrap";
import {
  DesignEntity,
  DesignStatus,
  DesignStatusColor,
  DesignStatusText,
} from "../interfaces";
import apiSJM from "../../../../api/apiSJM";
import { SweetAlert2 } from "../../../utils";
import { ReasonModal } from ".";

const Statuses: DesignStatus[] = [
  "PENDIENTE",
  "PROCESO",
  "PAUSADO",
  "PRESENTADO",
  "REVISION",
  "FINALIZADO",
  "CANCELADO",
];
interface Props {
  design: DesignEntity["design"];
}

function CustomToggle({ children, eventKey }: any) {
  const decoratedOnClick = useAccordionButton(eventKey);
  return (
    <Button
      size="sm"
      variant="transparent"
      type="button"
      className="py-1"
      onClick={decoratedOnClick}
    >
      {children}
    </Button>
  );
}

export const AccordionHeader = ({ design }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<DesignStatus>(design.status);
  const [newStatus, setNewStatus] = useState<DesignStatus | null>(null);

  const handleReasonModalClose = async (reason: string) => {
    setShowModal(false);
    if (!reason) return;

    console.log(reason);

    const message = `¿Desea cambiar el estado del diseño a ${newStatus}?`;
    const confirmation = await SweetAlert2.confirm(message);
    if (!confirmation.isConfirmed) return;

    try {
      const { data } = await apiSJM.patch(`/designs/${design.id}/status`, {
        status: newStatus,
        reason,
      });
      if (data.ok) setStatus(data.status);
      SweetAlert2.successToast("¡Estado actualizado correctamente!");
    } catch (error) {
      console.log(error);
      SweetAlert2.errorAlert("¡No se pudo actualizar el estado del diseño!");
    }
  };

  const handleStatusChange = (newStatus: DesignStatus) => {
    setNewStatus(newStatus);
    setShowModal(true);
  };

  return (
    <Fragment>
      <Accordion className="mb-3">
        <Card>
          <Card.Header className="border-0">
            <div className="d-flex flex-column flex-xl-row gap-3 justify-content-between align-items-center">
              <p className="mb-0 text-center text-lg-start">
                Instancia de diseño:{" "}
                <b>{`${design.type} - ${design.project} - ${design.client}`}</b>
              </p>
              <Dropdown>
                Estado diseño:
                <Dropdown.Toggle
                  id="dropdown-basic"
                  size="sm"
                  variant="transparent"
                  className="ms-2 py-0 px-3 rounded rounded-pill"
                  style={{ backgroundColor: DesignStatusColor[status] }}
                >
                  <span className="fw-bold me-1">{DesignStatusText[status]}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {Statuses.map((status) => (
                    <Dropdown.Item
                      className="small"
                      key={status}
                      onClick={() => handleStatusChange(status)}
                    >
                      Marcar <b>{DesignStatusText[status]}</b>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <CustomToggle eventKey="0">
                <small className="me-2 text-muted">VER MÁS</small>
                <i className="bi bi-chevron-down text-muted "></i>
              </CustomToggle>
            </div>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="small">{design.description}</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <ReasonModal
        newStatus={newStatus}
        showModal={showModal}
        hideModal={handleReasonModalClose}
      />
    </Fragment>
  );
};
