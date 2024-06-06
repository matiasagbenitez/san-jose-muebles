import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Modal, Button } from "react-bootstrap";
import { CustomInput } from "../../../components";

interface Props {
  showModal: boolean;
  hideModal: () => void;
  handleSubmit: (values: TaskFormValues) => void;
  isFormSubmitted: boolean;
}

export interface TaskFormValues {
  title: string;
  description: string;
}

const initialForm = {
  title: "",
  description: "",
};

export const TaskModal = ({
  showModal,
  hideModal,
  handleSubmit,
  isFormSubmitted,
}: Props) => {
  const submit = (values: TaskFormValues) => {
    handleSubmit(values);
  };

  return (
    <Modal show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Nueva tarea de diseño</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={initialForm}
        onSubmit={(values) => {
          submit(values);
        }}
        validationSchema={Yup.object({
          title: Yup.string()
            .required("El título de la tarea es requerido")
            .max(80, "El título de la tarea no debe superar los 80 caracteres"),
          description: Yup.string()
            .required("La descripción de la tarea es requerida")
            .max(
              255,
              "La descripción de la tarea no debe superar los 255 caracteres"
            ),
        })}
      >
        {({ errors, touched }) => (
          <Form id="form" className="">
            <Modal.Body>
              <CustomInput.Text
                name="title"
                isInvalid={!!errors.title && touched.title}
                label="Título de la tarea"
                isRequired
                placeholder="Ej: añadir barra de bebidas"
                disabled={isFormSubmitted}
              />
              <CustomInput.TextArea
                name="description"
                isInvalid={!!errors.description && touched.description}
                label="Descripción de la tarea"
                isRequired
                placeholder="Ej: añadir barra de bebidas con las siguientes características..."
                disabled={isFormSubmitted}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                size="sm"
                variant="secondary"
                onClick={hideModal}
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
