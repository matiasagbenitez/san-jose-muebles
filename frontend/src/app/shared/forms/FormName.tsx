import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { MyTextInput } from "../../components/forms";
import { SweetAlert2 } from "../../utils";

interface NameInterface {
  name: string;
}

interface FormProps {
  show: boolean;
  onHide: () => void;
  editingId: number | null;
  form: NameInterface;
  onSubmit: (values: any) => void;
  prefix: string;
  title: string;
  isFormSubmitting?: boolean;
}

export const FormName = ({
  show,
  onHide,
  form,
  editingId,
  onSubmit,
  prefix,
  title,
  isFormSubmitting,
}: FormProps) => {
  const handleLocalSubmit = async (values: NameInterface) => {
    const confirmation = await SweetAlert2.confirm(
      editingId
        ? `¿Está seguro de modificar ${title}?`
        : `¿Está seguro de crear ${title}?`
    );
    if (confirmation.isConfirmed) {
      onSubmit(values);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <div className="p-4">
        <h1 className="fs-5">
          {editingId ? `Modificar ${title}` : `Crear ${title}`}
        </h1>
        <hr className="my-2" />

        <Formik
          initialValues={form}
          onSubmit={(values) => {
            handleLocalSubmit(values);
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("El nombre es requerido"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <MyTextInput
                label={`Nombre ${prefix} ${title}`}
                name="name"
                type="text"
                placeholder={`Ingrese el nombre ${prefix} ${title}`}
                isInvalid={!!errors.name && touched.name}
              />

              <Button
                type="submit"
                variant="primary"
                className="mt-3 float-end"
                size="sm"
                disabled={isFormSubmitting}
              >
                <i className="bi bi-floppy me-2"></i>
                {isFormSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
