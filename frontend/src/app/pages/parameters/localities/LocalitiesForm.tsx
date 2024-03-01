import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { MySelect, MyTextInput } from "../../../components/forms";
import { LocalityFormInterface } from ".";

interface FormProps {
  show: boolean;
  onHide: () => void;
  editingId: number | null;
  form: LocalityFormInterface;
  onSubmit: (values: any) => void;
  provinces: any[];
}

export const LocalitiesForm = ({
  show,
  onHide,
  form,
  editingId,
  onSubmit,
  provinces,
}: FormProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <div className="p-4">
        <h1 className="fs-5">{editingId ? "Editar localidad" : "Crear localidad"}</h1>
        <hr className="my-2" />

        <Formik
          initialValues={form}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("El nombre es requerido"),
            id_province: Yup.string().required("La provincia es requerida"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <MyTextInput
                label="Nombre de la localidad"
                name="name"
                type="text"
                placeholder="Ingrese el nombre de la localidad"
                isInvalid={!!errors.name && touched.name}
              />

              <MySelect
                label="Provincia"
                name="id_province"
                as="select"
                placeholder="Seleccione una provincia"
                isInvalid={!!errors.id_province && touched.id_province}
              >
                <option value="">Seleccione una provincia</option>
                {provinces.map((province: any) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </MySelect>

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
