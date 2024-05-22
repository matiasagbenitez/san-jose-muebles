import { useState, useEffect } from "react";
import { Button, ButtonGroup, Col, Modal, Row } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../../../api/apiSJM";
import { CustomInput } from "../../../../components";

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
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? "Actualizar proveedor" : "Registrar nuevo proveedor"}
        </Modal.Title>
      </Modal.Header>

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
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <CustomInput.Text
                    label="Nombre del proveedor"
                    name="name"
                    placeholder="Ingrese el nombre del proveedor"
                    isInvalid={!!errors.name && touched.name}
                    disabled={isFormSubmitting}
                    isRequired
                  />
                </Col>
                <Col md={6}>
                  <CustomInput.Text
                    label="DNI/CUIT"
                    name="dni_cuit"
                    placeholder="DNI/CUIT del proveedor"
                    isInvalid={!!errors.dni_cuit && touched.dni_cuit}
                    disabled={isFormSubmitting}
                  />
                </Col>
                <Col md={6}>
                  <CustomInput.Text
                    label="Teléfono"
                    name="phone"
                    placeholder="Ingrese el teléfono del proveedor"
                    isInvalid={!!errors.phone && touched.phone}
                    disabled={isFormSubmitting}
                  />
                </Col>
                <Col md={6}>
                  <CustomInput.Text
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Ingrese el email del proveedor"
                    isInvalid={!!errors.email && touched.email}
                    disabled={isFormSubmitting}
                  />
                </Col>
                <Col md={6}>
                  <CustomInput.Text
                    label="Dirección"
                    name="address"
                    placeholder="Ingrese la dirección"
                    isInvalid={!!errors.address && touched.address}
                    disabled={isFormSubmitting}
                  />
                </Col>

                <Col md={6}>
                  <CustomInput.Select
                    label="Localidad"
                    name="id_locality"
                    placeholder="Seleccione una localidad"
                    isInvalid={!!errors.id_locality && touched.id_locality}
                    disabled={isFormSubmitting}
                    isRequired
                  >
                    <option value="">Seleccione una localidad</option>
                    {localities &&
                      localities.map((locality) => (
                        <option key={locality.id} value={locality.id}>
                          {locality.name}
                        </option>
                      ))}
                  </CustomInput.Select>
                </Col>

                <CustomInput.TextArea
                  label="Anotaciones"
                  name="annotations"
                  placeholder="Ingrese anotaciones adicionales"
                  rows={4}
                  isInvalid={!!errors.annotations && touched.annotations}
                  disabled={isFormSubmitting}
                />
              </Row>
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
                  {editMode ? "Actualizar información" : "Registrar proveedor"}
                </Button>
              </ButtonGroup>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
