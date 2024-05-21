import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Col, Modal, Row } from "react-bootstrap";

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
      <div className="p-4">
        <h1 className="fs-5">
          {editMode ? "Modificar entidad" : "Crear entidad"}
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
              </Row>

              <CustomInput.TextArea
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
                {editMode ? "Guardar cambios" : "Crear entidad"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
