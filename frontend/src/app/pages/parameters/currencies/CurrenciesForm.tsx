import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { MyCheckbox, MyTextInput } from "../../../components/forms";
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
            symbol: Yup.string().required("El símbolo es requerido"),
            is_monetary: Yup.boolean().required("Debe especificar si es dinero"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <MyTextInput
                label="Nombre de la moneda"
                name="name"
                type="text"
                placeholder="Ingrese el nombre de la moneda (ej. Dólar, Euro, etc.)"
                isInvalid={!!errors.name && touched.name}
              />

              <MyTextInput
                label="Símbolo de la moneda"
                name="symbol"
                type="text"
                placeholder="Ingrese el símbolo de la moneda (ej. USD, EUR, etc.)"
                isInvalid={!!errors.symbol && touched.symbol}
              />

             <MyCheckbox
                label="Agregar símbolo de dinero ($)"
                name="is_monetary"
                type="checkbox"
                isInvalid={!!errors.is_monetary && touched.is_monetary}
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
