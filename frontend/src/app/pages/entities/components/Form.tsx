import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, ButtonGroup, Col, Modal, Row } from "react-bootstrap";

import apiSJM from "../../../../api/apiSJM";
import { CustomInput } from "../../../components";

interface EntityFormInterface {
  name: string;
  dni_cuit?: string;
  phone?: string;
  email?: string;
  address?: string;
  id_locality: string;
  annotations?: string;
}

const entityForm: EntityFormInterface = {
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
  initialForm?: EntityFormInterface;
  isFormSubmitting: boolean;
  localities: LocalitiesInterface[];
}

export const EntitiesForm = ({
  show,
  onHide,
  editMode = false,
  onSubmit,
  initialForm = entityForm,
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
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode
            ? "Actualizar información de entidad"
            : "Registrar nueva entidad"}
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
                <Col lg={6}>
                  <CustomInput.Text
                    label="Nombre de la entidad"
                    name="name"
                    placeholder="Ingrese el nombre de la entidad"
                    isInvalid={!!errors.name && touched.name}
                    disabled={isFormSubmitting}
                    isRequired
                  />
                </Col>
                <Col lg={6}>
                  <CustomInput.Text
                    label="DNI/CUIT"
                    name="dni_cuit"
                    placeholder="DNI/CUIT de la entidad"
                    isInvalid={!!errors.dni_cuit && touched.dni_cuit}
                    disabled={isFormSubmitting}
                  />
                </Col>
                <Col lg={6}>
                  <CustomInput.Text
                    label="Teléfono"
                    name="phone"
                    placeholder="Ingrese el teléfono de la entidad"
                    isInvalid={!!errors.phone && touched.phone}
                    disabled={isFormSubmitting}
                  />
                </Col>
                <Col lg={6}>
                  <CustomInput.Text
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Ingrese el email de la entidad"
                    isInvalid={!!errors.email && touched.email}
                    disabled={isFormSubmitting}
                  />
                </Col>
                <Col lg={6}>
                  <CustomInput.Text
                    label="Dirección"
                    name="address"
                    type="text"
                    placeholder="Ingrese la dirección"
                    isInvalid={!!errors.address && touched.address}
                    disabled={isFormSubmitting}
                  />
                </Col>

                <Col lg={6}>
                  <CustomInput.Select
                    label="Localidad"
                    name="id_locality"
                    placeholder="Seleccione una localidad"
                    isInvalid={!!errors.id_locality && touched.id_locality}
                    disabled={isFormSubmitting}
                    isRequired
                  >
                    <option value="">Seleccione una localidad</option>
                    {localitiesLocal &&
                      localitiesLocal.map((locality) => (
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
                  {editMode ? "Actualizar información" : "Registrar entidad"}
                </Button>
              </ButtonGroup>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
