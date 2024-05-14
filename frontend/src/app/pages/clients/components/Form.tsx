import { Button, Col, Modal, Row } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { MySelect, MyTextArea, MyTextInput } from "../../../components/forms";
import { useEffect, useState } from "react";
import apiSJM from "../../../../api/apiSJM";

interface ClientFormInterface {
  name: string;
  last_name: string;
  dni_cuit?: string;
  phone?: string;
  email?: string;
  address?: string;
  id_locality: string;
  annotations?: string;
}

const clientForm: ClientFormInterface = {
  name: "",
  last_name: "",
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
  isFormSubmitting: boolean;
  localities: LocalitiesInterface[];
}

export const ClientsForm = ({
  show,
  onHide,
  editMode = false,
  onSubmit,
  initialForm = clientForm,
  isFormSubmitting,
  localities = [],
}: FormProps) => {
  const [localitiesLocal, setLocalitiesLocal] = useState(localities);

  const fetchLocalities = async () => {
    try {
      const { data } = await apiSJM.get("/localities");
      setLocalitiesLocal(data.localities);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (editMode) fetchLocalities();
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
            last_name: Yup.string().required("El apellido es requerido"),
            id_locality: Yup.string().required("La localidad es requerida"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <Row>
                <Col md={6}>
                  <MyTextInput
                    label="Nombre del cliente *"
                    name="name"
                    type="text"
                    placeholder="Ingrese el nombre del cliente"
                    isInvalid={!!errors.name && touched.name}
                    disabled={isFormSubmitting}
                    obligatory
                  />
                </Col>
                <Col md={6}>
                  <MyTextInput
                    label="Apellido del cliente *"
                    name="last_name"
                    type="text"
                    placeholder="Ingrese el apellido del cliente"
                    isInvalid={!!errors.name && touched.name}
                    disabled={isFormSubmitting}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <MyTextInput
                    label="DNI/CUIT"
                    name="dni_cuit"
                    type="text"
                    placeholder="DNI/CUIT del cliente"
                    isInvalid={!!errors.dni_cuit && touched.dni_cuit}
                    disabled={isFormSubmitting}
                  />
                </Col>
                <Col md={6}>
                  <MyTextInput
                    label="Teléfono"
                    name="phone"
                    type="text"
                    placeholder="Ingrese el teléfono del cliente"
                    isInvalid={!!errors.phone && touched.phone}
                    disabled={isFormSubmitting}
                  />
                </Col>
                <Col md={6}>
                  <MyTextInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Ingrese el email del cliente"
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
                    label="Localidad *"
                    name="id_locality"
                    as="select"
                    placeholder="Seleccione una localidad"
                    isInvalid={!!errors.id_locality && touched.id_locality}
                    disabled={isFormSubmitting}
                  >
                    <option value="">Seleccione una localidad</option>
                    {localitiesLocal &&
                      localitiesLocal.map((locality) => (
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
                {editMode ? "Guardar cambios" : "Crear cliente"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
