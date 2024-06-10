import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Modal, Button } from "react-bootstrap";
import { CustomInput } from "../../../components";
import { Status, ProjectStatuses } from "../interfaces";

interface Props {
  newStatus: Status | null;
  showModal: boolean;
  handleSubmit: (reason: string) => void;
  hideModal: (reason: string) => void;
  isFormSubmitted: boolean;
}

const initialForm = {
  reason: "",
};

export const ReasonModal = ({
  newStatus,
  showModal,
  handleSubmit,
  hideModal,
  isFormSubmitted,
}: Props) => {
  return (
    <Modal show={showModal} onHide={() => hideModal("")}>
      <Modal.Header>
        <Modal.Title>Cambiar estado del proyecto</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={initialForm}
        onSubmit={(values) => {
          handleSubmit(values.reason);
        }}
        validationSchema={Yup.object({
          reason: Yup.string()
            // .required("La razón del cambio de estado es requerida")
            .max(255, "La razón no puede superar los 255 caracteres"),
        })}
      >
        {({ errors, touched }) => (
          <Form id="form" className="">
            <Modal.Body>
              {newStatus && (
                <p className="mb-2 small">
                  Actualizar estado del proyecto a{" "}
                  <i className={`ms-2 ${ProjectStatuses[newStatus].icon}`}></i>
                  <b>{ProjectStatuses[newStatus].text} </b>
                </p>
              )}
              <CustomInput.TextArea
                label="Información del cambio de estado"
                className="mb-0"
                isInvalid={!!errors.reason && touched.reason}
                name="reason"
                placeholder="Proporcione detalles sobre el cambio de estado del proyecto"
                disabled={isFormSubmitted}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => hideModal("")}
                disabled={isFormSubmitted}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                size="sm"
                disabled={isFormSubmitted}
              >
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
