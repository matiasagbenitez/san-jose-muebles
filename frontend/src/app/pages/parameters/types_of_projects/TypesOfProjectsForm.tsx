import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { MyTextArea, MyTextInput } from "../../../components/forms";
import { TypeOfProjectFormInterface } from ".";

interface FormProps {
  show: boolean;
  onHide: () => void;
  editingId: number | null;
  form: TypeOfProjectFormInterface;
  onSubmit: (values: any) => void;
}

export const TypesOfProjectsForm = ({
  show,
  onHide,
  form,
  editingId,
  onSubmit,
}: FormProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <div className="p-4">
        <h1 className="fs-5">{editingId ? "Editar tipo de proyecto" : "Crear tipo de proyecto"}</h1>
        <hr className="my-2" />

        <Formik
          initialValues={form}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("El nombre es requerido"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <MyTextInput
                label="Nombre del tipo de proyecto"
                name="name"
                type="text"
                placeholder="Ingrese el nombre del tipo de proyecto"
                isInvalid={!!errors.name && touched.name}
              />

              {/* <MyTextInput
                label="Descripción del tipo de proyecto"
                name="description"
                type="text"
                placeholder="Ingrese la descripción del tipo de proyecto"
                isInvalid={!!errors.description && touched.description}
              /> */}

              <MyTextArea 
                label="Descripción del tipo de proyecto"
                name="description"
                placeholder="Ingrese la descripción del tipo de proyecto"
                isInvalid={!!errors.description && touched.description}
                rows={5}
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
