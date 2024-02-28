import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { MySelect, MyTextInput } from "../../../components/forms";
import { ProvinceFormInterface } from ".";

interface FormProps {
  show: boolean;
  onHide: () => void;
  editingId: number | null;
  form: ProvinceFormInterface;
  onSubmit: (values: any) => void;
  countries: any[];
}

export const ProvincesForm = ({
  show,
  onHide,
  form,
  editingId,
  onSubmit,
  countries,
}: FormProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <div className="p-4">
        <h1 className="fs-5">
          {editingId ? "Editar provincia" : "Crear provincia"}
        </h1>
        <hr className="my-2" />

        <Formik
          initialValues={form}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("El nombre es requerido"),
            id_country: Yup.string().required("El país es requerido"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <MyTextInput
                label="Nombre de la provincia"
                name="name"
                type="text"
                placeholder="Ingrese el nombre de la provincia"
                isInvalid={!!errors.name && touched.name}
              />

              <MySelect
                label="País"
                name="id_country"
                as="select"
                placeholder="Seleccione un país"
                isInvalid={!!errors.id_country && touched.id_country}
              >
                <option value="">Seleccione un país</option>
                {countries.map((country: any) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
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
