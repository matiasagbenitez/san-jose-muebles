import { useState, useEffect } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../../api/apiSJM";
import { MySelect, MyTextArea, MyTextInput } from "../../../components/forms";

interface ClientFormInterface {
  name: string;
  dni_cuit?: string;
  phone?: string;
  email?: string;
  address?: string;
  id_locality: string;
  annotations?: string;
}

const clientForm: ClientFormInterface = {
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
  initialForm?: ClientFormInterface;
  isFormSubmitted?: boolean;
}

export const ClientsForm = ({
  show,
  onHide,
  editMode = false,
  onSubmit,
  initialForm = clientForm,
  isFormSubmitted,
}: FormProps) => {
  const [localities, setLocalities] = useState<LocalitiesInterface[]>([]);

  const fetch = async () => {
    const { data } = await apiSJM.get("/localities");
    setLocalities(data.localities);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <div className="p-4">
        <h1 className="fs-5">
          {editMode ? "Modificar cliente" : "Crear cliente"}
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
                    label="Nombre del cliente"
                    name="name"
                    type="text"
                    placeholder="Ingrese el nombre del cliente"
                    isInvalid={!!errors.name && touched.name}
                  />
                </Col>
                <Col md={6}>
                  <MyTextInput
                    label="DNI/CUIT"
                    name="dni_cuit"
                    type="text"
                    placeholder="DNI/CUIT del cliente"
                    isInvalid={!!errors.dni_cuit && touched.dni_cuit}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <MyTextInput
                    label="Teléfono"
                    name="phone"
                    type="text"
                    placeholder="Ingrese el teléfono del cliente"
                    isInvalid={!!errors.phone && touched.phone}
                  />
                </Col>
                <Col md={6}>
                  <MyTextInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Ingrese el email del cliente"
                    isInvalid={!!errors.email && touched.email}
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
                  />
                </Col>

                <Col md={6}>
                  <MySelect
                    label="Localidad"
                    name="id_locality"
                    as="select"
                    placeholder="Seleccione una localidad"
                    isInvalid={!!errors.id_locality && touched.id_locality}
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
              />

              <Button
                type="submit"
                variant="primary"
                className="mt-3 float-end"
                size="sm"
                disabled={isFormSubmitted}
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
