import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { MyTextInput } from "../../../components/forms";
import { CurrencyFormInterface } from ".";

interface FormProps {
  show: boolean;
  onHide: () => void;
  editingId: number | null;
  form: CurrencyFormInterface;
  onSubmit: (values: any) => void;
}

export const CurrenciesForm = ({
  show,
  onHide,
  form,
  editingId,
  onSubmit,
}: FormProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <div className="p-4">
        <h1 className="fs-5">{editingId ? "Editar moneda" : "Crear moneda"}</h1>
        <hr className="my-2" />

        <Formik
          initialValues={form}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("El nombre es requerido"),
            code: Yup.string().required("El código es requerido"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <MyTextInput
                label="Nombre de la moneda"
                name="name"
                type="text"
                placeholder="Ingrese el nombre de la moneda"
                isInvalid={!!errors.name && touched.name}
              />

              <MyTextInput
                label="Código de la moneda"
                name="code"
                type="text"
                placeholder="Ingrese el código de la moneda"
                isInvalid={!!errors.code && touched.code}
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
