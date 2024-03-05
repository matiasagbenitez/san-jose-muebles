import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { MyTextInput } from "../../../components/forms";
import { UnitOfMeasureFormInterface } from ".";

interface FormProps {
  show: boolean;
  onHide: () => void;
  editingId: number | null;
  form: UnitOfMeasureFormInterface;
  onSubmit: (values: any) => void;
}

export const UnitsOfMeasuresForm = ({
  show,
  onHide,
  form,
  editingId,
  onSubmit,
}: FormProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <div className="p-4">
        <h1 className="fs-5">{editingId ? "Modificar unidad de medida" : "Crear unidad de medida"}</h1>
        <hr className="my-2" />

        <Formik
          initialValues={form}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("El nombre es requerido"),
            symbol: Yup.string().required("El símbolo es requerido"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <MyTextInput
                label="Nombre de la unidad de medida"
                name="name"
                type="text"
                placeholder="Ingrese el nombre de la unidad de medida"
                isInvalid={!!errors.name && touched.name}
              />

              <MyTextInput
                label="Símbolo de la unidad de medida"
                name="symbol"
                type="text"
                placeholder="Ingrese el símbolo de la unidad de medida"
                isInvalid={!!errors.symbol && touched.symbol}
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
