import { useState, useEffect } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../../../api/apiSJM";
import {
  MySelect,
  MyTextArea,
  MyTextInput,
} from "../../../../components/forms";

interface SupplierFormInterface {
  name: string;
  dni_cuit?: string;
  phone?: string;
  email?: string;
  address?: string;
  id_locality: string;
  annotations?: string;
}

const supplierForm: SupplierFormInterface = {
  name: "",
  dni_cuit: "",
  phone: "",
  email: "",
  address: "",
  id_locality: "",
  annotations: "",
};

interface LocalitiesInterface {
  id: number;
  name: string;
}

interface FormProps {
  show: boolean;
  onHide: () => void;
  editMode?: boolean;
  onSubmit: (values: any) => void;
  initialForm?: SupplierFormInterface;
  isFormSubmitting: boolean;
}

export const SuppliersForm = ({
  show,
  onHide,
  editMode = false,
  onSubmit,
  initialForm = supplierForm,
  isFormSubmitting,
}: FormProps) => {
  const [localities, setLocalities] = useState<LocalitiesInterface[]>([]);

  const fetch = async () => {
    const response = await apiSJM.get("/localities");
    setLocalities(response.data.localities);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <div className="p-4">
        <h1 className="fs-5">
          {editMode ? "Modificar proveedor" : "Crear proveedor"}
        </h1>
        <hr className="my-2" />

        <Formik
          initialValues={initialForm}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("El nombre es requerido"),
            id_locality: Yup.string().required("La localidad es requerida"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <Row>
                <Col md={6}>
                  <MyTextInput
                    label="Nombre del proveedor"
                    name="name"
                    type="text"
                    placeholder="Ingrese el nombre del proveedor"
                    isInvalid={!!errors.name && touched.name}
                    disabled={isFormSubmitting}
                  />
                </Col>
                <Col md={6}>
                  <MyTextInput
                    label="DNI/CUIT"
                    name="dni_cuit"
                    type="text"
                    placeholder="DNI/CUIT del proveedor"
                    isInvalid={!!errors.dni_cuit && touched.dni_cuit}
                    disabled={isFormSubmitting}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <MyTextInput
                    label="Teléfono"
                    name="phone"
                    type="text"
                    placeholder="Ingrese el teléfono del proveedor"
                    isInvalid={!!errors.phone && touched.phone}
                    disabled={isFormSubmitting}
                  />
                </Col>
                <Col md={6}>
                  <MyTextInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Ingrese el email del proveedor"
                    isInvalid={!!errors.email && touched.email}
                    disabled={isFormSubmitting}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <MyTextInput
                    label="Dirección"
                    name="address"
                    type="text"
                    placeholder="Ingrese la dirección"
                    isInvalid={!!errors.address && touched.address}
                    disabled={isFormSubmitting}
                  />
                </Col>

                <Col md={6}>
                  <MySelect
                    label="Localidad"
                    name="id_locality"
                    as="select"
                    placeholder="Seleccione una localidad"
                    isInvalid={!!errors.id_locality && touched.id_locality}
                    disabled={isFormSubmitting}
                  >
                    <option value="">Seleccione una localidad</option>
                    {localities &&
                      localities.map((locality) => (
                        <option key={locality.id} value={locality.id}>
                          {locality.name}
                        </option>
                      ))}
                  </MySelect>
                </Col>
              </Row>

              <MyTextArea
                label="Anotaciones"
                name="annotations"
                placeholder="Ingrese anotaciones adicionales"
                rows={4}
                isInvalid={!!errors.annotations && touched.annotations}
                disabled={isFormSubmitting}
              />

              <Button
                type="submit"
                variant="primary"
                className="mt-3 float-end"
                size="sm"
                disabled={isFormSubmitting}
              >
                <i className="bi bi-floppy me-2"></i>
                {editMode ? "Guardar cambios" : "Crear proveedor"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
