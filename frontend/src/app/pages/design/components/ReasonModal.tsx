import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Modal, Button } from "react-bootstrap";
import { CustomInput } from "../../../components";
import { DesignStatus } from "../interfaces";
import { DesignStatusTextBadge } from ".";

interface Props {
  newStatus: DesignStatus | null;
  showModal: boolean;
  hideModal: (reason: string) => void;
}

const initialForm = {
  reason: "",
};

export const ReasonModal = ({ newStatus, showModal, hideModal }: Props) => {
  const handleSubmit = (reason: string) => {
    hideModal(reason);
  };

  return (
    <Modal show={showModal} onHide={() => hideModal("")}>
      <Modal.Header>
        <Modal.Title>Cambiar estado de diseño</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={initialForm}
        onSubmit={(values) => {
          handleSubmit(values.reason);
        }}
        validationSchema={Yup.object({
          reason: Yup.string()
            .required("La razón del cambio de estado es requerida")
            .max(255, "La razón no puede superar los 255 caracteres"),
        })}
      >
        {({ errors, touched }) => (
          <Form id="form" className="">
            <Modal.Body>
              {newStatus && (
                <p className="mb-2 small">
                  Actualizar estado de diseño a{" "}
                  <DesignStatusTextBadge status={newStatus} />
                </p>
              )}
              <CustomInput.TextArea
                label="Información del cambio de estado"
                isRequired
                className="mb-0"
                isInvalid={!!errors.reason && touched.reason}
                name="reason"
                placeholder="Proporcione detalles sobre el cambio de estado del diseño"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => hideModal("")}
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit" size="sm">
                <i className="bi bi-floppy me-2"></i>
                Confirmar
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
