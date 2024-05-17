import { CustomInput } from "../../../components";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Button, Modal } from "react-bootstrap";

interface Props {
  showModal: boolean;
  closeModal: () => void;
  form: {
    status: "NO_ENVIADO" | "ENVIADO" | "ACEPTADO" | "RECHAZADO";
    comment: string;
  };
  isFormSubmitting: boolean;
  handleUpdateStatus: (values: any) => void;
  estimateStatus: string;
}

export const EstimateStatusForm = (props: Props) => {
  const {
    showModal,
    closeModal,
    form,
    isFormSubmitting,
    handleUpdateStatus,
    estimateStatus,
  } = props;

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">Actualizar estado del presupuesto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={form}
          onSubmit={(values) => {
            handleUpdateStatus(values);
          }}
          validationSchema={Yup.object({
            status: Yup.string()
              .required("El estado es requerido")
              .test(
                "is-different",
                "El estado debe ser diferente al actual",
                (value) => value !== estimateStatus
              ),

            comment: Yup.string()
              .required("El comentario es requerido")
              .min(5, "El comentario debe tener al menos 5 caracteres")
              .max(255, "El comentario debe tener como máximo 255 caracteres"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <CustomInput.Select
                label="Estado del presupuesto"
                name="status"
                as="select"
                isInvalid={!!errors.status && touched.status}
                disabled={isFormSubmitting}
              >
                <option value="NO_ENVIADO">NO ENVIADO</option>
                <option value="ENVIADO">ENVIADO</option>
                <option value="ACEPTADO">ACEPTADO</option>
                <option value="RECHAZADO">RECHAZADO</option>
              </CustomInput.Select>

              <CustomInput.TextArea
                label="Comentarios"
                name="comment"
                placeholder="Ingrese un comentario"
                rows={4}
                isInvalid={!!errors.comment && touched.comment}
                disabled={isFormSubmitting}
              />

              <Button
                type="submit"
                variant="primary"
                className="mt-3 float-end"
                size="sm"
                disabled={isFormSubmitting}
              >
                <i className="bi bi-floppy me-2"></i>Guardar cambios
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};
