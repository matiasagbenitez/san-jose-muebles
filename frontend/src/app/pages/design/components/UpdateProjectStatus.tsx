import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { DesignEntity, DesignStatus, DesignStatuses } from "../interfaces";
import apiSJM from "../../../../api/apiSJM";
import { SweetAlert2 } from "../../../utils";
import { ReasonModal } from ".";

interface Props {
  design: DesignEntity["design"];
}

export const UpdateProjectStatus = ({ design }: Props) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<DesignStatus>(design.status);
  const [newStatus, setNewStatus] = useState<DesignStatus | null>(null);

  const handleReasonModalClose = async (reason: string) => {
    setShowModal(false);

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

  const handleRedirectHistorial = () => {
    navigate(`/disenos/${design.id}/historial`);
  };

  return (
    <div
      className="d-flex border rounded align-items-center justify-content-center"
      style={{
        height: "52px",
      }}
    >
      <Dropdown>
        Estado diseño:
        <Dropdown.Toggle
          id="dropdown-basic"
          size="sm"
          variant="transparent"
          className="rounded ms-1"
        >
          <span className="fw-bold me-1">
            <i className={`${DesignStatuses[status].icon} me-1`}></i>
            {DesignStatuses[status].text}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.ItemText className="small fw-bold">
            Actualizar el estado de diseño
          </Dropdown.ItemText>
          <Dropdown.Divider className="my-1" />
          {Object.entries(DesignStatuses).map(([status, { text, icon }]) => (
            <Dropdown.Item
              className="small"
              key={status}
              onClick={() => handleStatusChange(status as DesignStatus)}
            >
              <i className={`${icon}`}></i>
              {text}
            </Dropdown.Item>
          ))}

          <Dropdown.Divider className="my-1" />
          <Dropdown.Item
            key="historial"
            className="small text-muted"
            onClick={handleRedirectHistorial}
          >
            <i className="bi bi-clock-history me-1"></i> Ver historial de
            cambios
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <ReasonModal
        newStatus={newStatus}
        showModal={showModal}
        hideModal={handleReasonModalClose}
      />
    </div>
  );
};
