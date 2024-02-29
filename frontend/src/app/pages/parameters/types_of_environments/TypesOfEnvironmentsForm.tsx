import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { MyTextInput } from "../../../components/forms";
import { TypeOfEnvironmentFormInterface } from ".";

interface FormProps {
  show: boolean;
  onHide: () => void;
  editingId: number | null;
  form: TypeOfEnvironmentFormInterface;
  onSubmit: (values: any) => void;
}

export const TypesOfEnvironmentsForm = ({ show, onHide, form, editingId, onSubmit }: FormProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <div className="p-4">
        <h1 className="fs-5">{editingId ? "Editar tipo de ambiente" : "Crear tipo de ambiente"}</h1>
        <hr className="my-2" />

        <Formik
          initialValues={form}
          onSubmit={(values) => { onSubmit(values); }}
          validationSchema={Yup.object({ name: Yup.string().required("El nombre es requerido") })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <MyTextInput
                label="Nombre del tipo de ambiente"
                name="name"
                type="text"
                placeholder="Ingrese el nombre del tipo de ambiente"
                isInvalid={!!errors.name && touched.name}
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
