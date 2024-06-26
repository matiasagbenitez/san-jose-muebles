import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Modal, Button } from "react-bootstrap";
import { CustomInput } from "../../../components";
import { DesignStatus, DesignStatuses } from "../interfaces";

interface Props {
  newStatus: DesignStatus | null;
  showModal: boolean;
  hideModal: (reason: string) => void;
  handleSubmit: (reason: string) => void;
}

const initialForm = {
  reason: "",
};

export const ReasonModal = ({
  newStatus,
  showModal,
  hideModal,
  handleSubmit,
}: Props) => {
  const submit = (reason: string) => {
    handleSubmit(reason);
  };

  return (
    <Modal show={showModal} onHide={() => hideModal("")}>
      <Modal.Header>
        <Modal.Title>Cambiar estado de diseño</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={initialForm}
        onSubmit={(values) => {
          submit(values.reason);
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
                  Actualizar estado de diseño a{" "}
                  <i className={`ms-2 ${DesignStatuses[newStatus].icon}`}></i>
                  <b>{DesignStatuses[newStatus].text} </b>
                </p>
              )}
              <CustomInput.TextArea
                label="Información del cambio de estado"
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
