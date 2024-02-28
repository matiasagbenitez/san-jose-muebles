import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { MyTextInput } from "../../../components/forms";
import { CountryFormInterface } from ".";

interface FormProps {
  show: boolean;
  onHide: () => void;
  editingId: number | null;
  form: CountryFormInterface;
  onSubmit: (values: any) => void;
}

export const CountriesForm = ({ show, onHide, form, editingId, onSubmit }: FormProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <div className="p-4">
        <h1 className="fs-5">{editingId ? "Editar país" : "Crear país"}</h1>
        <hr className="my-2" />

        <Formik
          initialValues={form}
          onSubmit={(values) => { onSubmit(values); }}
          validationSchema={Yup.object({ name: Yup.string().required("El nombre es requerido") })}
        >
          {({ errors }) => (
            <Form id="form">
              <MyTextInput
                label="Nombre del país"
                name="name"
                type="text"
                placeholder="Ingrese el nombre del país"
                invalid={errors.name}
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
