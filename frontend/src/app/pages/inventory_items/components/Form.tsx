import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { MySelect, MyTextInput } from "../../../components/forms";

interface FormInterface {
  id_inventory_categ: string;
  id_inventory_brand: string;
  name: string;
  status: "OPERATIVO" | "RESERVADO" | "RETIRADO" | "DESCARTADO";
}

const form: FormInterface = {
  id_inventory_categ: "",
  id_inventory_brand: "",
  name: "",
  status: "OPERATIVO",
};

interface FormProps {
  show: boolean;
  onHide: () => void;
  editMode?: boolean;
  onSubmit: (values: any) => void;
  initialForm?: FormInterface;
  isFormSubmitting?: boolean;
  brands: any[];
  categories: any[];
}

export const InventoryItemsForm = ({
  show,
  onHide,
  editMode = false,
  onSubmit,
  initialForm = form,
  isFormSubmitting,
  brands,
  categories,
}: FormProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <div className="p-4">
        <h1 className="fs-5">
          {editMode ? "Modificar artículo" : "Crear artículo"}
        </h1>
        <hr className="my-2" />

        <Formik
          initialValues={initialForm}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={Yup.object({
            id_inventory_categ: Yup.string().required(
              "La categoría del artículo es requerida"
            ),
            id_inventory_brand: Yup.string().required(
              "La marca del artículo es requerida"
            ),
            name: Yup.string().required("El nombre del artículo es requerido"),
            status: Yup.string()
              .required("El estado del artículo es requerido")
              .oneOf(["OPERATIVO", "RESERVADO", "RETIRADO", "DESCARTADO"]),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <MySelect
                label="Categoria"
                name="id_inventory_categ"
                as="select"
                placeholder="Seleccione una categoría"
                isInvalid={
                  !!errors.id_inventory_categ && touched.id_inventory_categ
                }
              >
                <option value="">Seleccione una categoría</option>
                {categories &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </MySelect>

              <MySelect
                label="Marca"
                name="id_inventory_brand"
                as="select"
                placeholder="Seleccione una marca"
                isInvalid={
                  !!errors.id_inventory_brand && touched.id_inventory_brand
                }
              >
                <option value="">Seleccione una marca</option>
                {brands &&
                  brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
              </MySelect>

              <MyTextInput
                label="Nombre del artículo"
                name="name"
                type="text"
                placeholder="Ejemplo: TALADRADOR PERCUTOR MAKITA HP1630"
                isInvalid={!!errors.name && touched.name}
              />

              {!editMode && (
                <MySelect
                  label="Estado"
                  name="status"
                  as="select"
                  placeholder="Seleccione un estado"
                  isInvalid={!!errors.status && touched.status}
                >
                  <option value="OPERATIVO">OPERATIVO</option>
                  <option value="RESERVADO">RESERVADO</option>
                  <option value="RETIRADO">RETIRADO</option>
                  <option value="DESCARTADO">DESCARTADO</option>
                </MySelect>
              )}

              <Button
                type="submit"
                variant="primary"
                className="mt-3 float-end"
                size="sm"
                disabled={isFormSubmitting}
              >
                <i className="bi bi-floppy me-1"></i>
                Guardar
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
