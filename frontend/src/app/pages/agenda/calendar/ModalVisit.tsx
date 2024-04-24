import { Event } from "react-big-calendar";
import { Button, Modal } from "react-bootstrap";
import { DayJsAdapter } from "../../../../helpers";
import { useNavigate } from "react-router-dom";

enum Priority {
  BAJA = "#B5D6A7",
  MEDIA = "#FFF47A",
  ALTA = "#FD9800",
  URGENTE = "#F55D1E",
}

interface Props {
  event: Event | null;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export const ModalVisit = ({ event, showModal, setShowModal }: Props) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/agenda/${event?.resource.id}`);
    setShowModal(false);
  };

  const handleRedirectWhastapp = () => {
    const formatedPhone = event?.resource.phone.replace(/[-\s]/g, "");
    window.open(`https://wa.me/54${formatedPhone}`);
  };

  return (
    <>
      {event && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header>
            <Modal.Title>Detalles de la visita</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="pt-2 pb-4 text-center">
              <h1 className="fs-4 mb-2 text-center">{event.resource.reason}</h1>
              {event.resource.schedule === "FULL_SCHEDULED" ? (
                <p className="mb-2">
                  {DayJsAdapter.toDatetimeString(event.start!)}
                </p>
              ) : (
                <p className="mb-2">
                  {DayJsAdapter.toDateString(event.start!)}
                </p>
              )}
              <span
                className="badge fs-6 mx-2"
                style={{
                  color: "black",
                  backgroundColor:
                    Priority[
                      event.resource.priority as keyof typeof Priority
                    ] || "#fff",
                }}
              >
                Prioridad {event.resource.priority}
              </span>
            </div>
            <p className="mb-2">
              <strong>Cliente:</strong> {event.resource.client}
            </p>
            <p className="mb-2">
              <strong>Teléfono:</strong> {event.resource.phone}
              <i
                className="bi bi-whatsapp ms-2 text-success"
                title="Enviar mensaje de WhatsApp"
                onClick={handleRedirectWhastapp}
              ></i>
            </p>
            <p className="mb-2">
              <strong>Localidad de visita:</strong> {event.resource.locality}
            </p>
            <p className="mb-2">
              <strong>Dirección de visita:</strong>{" "}
              {event.resource.address || "No especificada"}
            </p>
            <p className="mb-2">
              <strong>Notas adicionales:</strong>{" "}
              {event.resource.notes || "No especificadas"}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleRedirect()}
            >
              Ver detalle de visita
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
