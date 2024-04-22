import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import {
  MyColorInput,
  MyTextInput,
} from "../../../components/forms";
import { PriorityFormInterface } from ".";

interface FormProps {
  show: boolean;
  onHide: () => void;
  editingId: number | null;
  form: PriorityFormInterface;
  onSubmit: (values: any) => void;
}

export const VisitReasonForm = ({
  show,
  onHide,
  form,
  editingId,
  onSubmit,
}: FormProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <div className="p-4">
        <h1 className="fs-5">{editingId ? "Modificar motivo de visita" : "Crear motivo de visita"}</h1>
        <hr className="my-2" />

        <Formik
          initialValues={form}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("El nombre es requerido"),
            color: Yup.string().required("El color es requerido"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <MyTextInput
                label="Nombre del motivo de visita"
                name="name"
                type="text"
                placeholder="Ingrese el nombre del motivo de visita"
                isInvalid={!!errors.name && touched.name}
              />

              <MyColorInput
                label="Color"
                name="color"
                type="color"
                isInvalid={!!errors.color && touched.color}
              />

              <Button
                type="submit"
                variant="primary"
                className="mt-3 float-end"
                size="sm"
              >
                Guardar
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
