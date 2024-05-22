import { Button, ButtonGroup, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { CustomInput } from "../../../components";

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
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? "Modificar artículo" : "Registrar artículo"}
        </Modal.Title>
      </Modal.Header>

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
        })}
      >
        {({ errors, touched }) => (
          <Form id="form">
            <Modal.Body>
              <CustomInput.Select
                label="Categoria"
                name="id_inventory_categ"
                placeholder="Seleccione una categoría"
                isInvalid={
                  !!errors.id_inventory_categ && touched.id_inventory_categ
                }
                disabled={isFormSubmitting}
                isRequired
              >
                <option value="">Seleccione una categoría</option>
                {categories &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </CustomInput.Select>

              <CustomInput.Select
                label="Marca"
                name="id_inventory_brand"
                placeholder="Seleccione una marca"
                isInvalid={
                  !!errors.id_inventory_brand && touched.id_inventory_brand
                }
                disabled={isFormSubmitting}
                isRequired
              >
                <option value="">Seleccione una marca</option>
                {brands &&
                  brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
              </CustomInput.Select>

              <CustomInput.Text
                label="Nombre del artículo"
                name="name"
                placeholder="Ejemplo: TALADRADOR PERCUTOR MAKITA HP1630"
                isInvalid={!!errors.name && touched.name}
                disabled={isFormSubmitting}
                isRequired
              />

              {!editMode && (
                <CustomInput.Select
                  label="Estado"
                  name="status"
                  placeholder="Seleccione un estado"
                  isInvalid={!!errors.status && touched.status}
                  disabled={isFormSubmitting}
                  isRequired
                >
                  <option value="OPERATIVO">OPERATIVO</option>
                  <option value="RESERVADO">RESERVADO</option>
                  <option value="RETIRADO">RETIRADO</option>
                  <option value="DESCARTADO">DESCARTADO</option>
                </CustomInput.Select>
              )}
            </Modal.Body>

            <Modal.Footer>
              <ButtonGroup size="sm">
                <Button
                  variant="secondary"
                  disabled={isFormSubmitting}
                  onClick={onHide}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isFormSubmitting}
                >
                  <i className="bi bi-floppy mx-1"></i>{" "}
                  {editMode ? "Guardar cambios" : "Registrar artículo"}
                </Button>
              </ButtonGroup>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
