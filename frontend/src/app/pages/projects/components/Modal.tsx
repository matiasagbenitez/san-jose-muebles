import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Button, ButtonGroup, Modal } from "react-bootstrap";

import { ProjectFormInterface } from "../interfaces";
import { CustomInput } from "../../../components";

const initialForm: ProjectFormInterface = {
  id_client: "",
  title: "",
  priority: "MEDIA",
  id_locality: "",
  address: "",
  requested_deadline: null,
  estimated_deadline: null,
};

interface ParamsInterface {
  id: number;
  label: string;
}

interface FormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (values: any) => void;
  clients: ParamsInterface[];
  localities: ParamsInterface[];
  isFormSubmitting: boolean;
}

export const CreateProjectModal = ({
  show,
  onHide,
  onSubmit,
  clients,
  localities,
  isFormSubmitting,
}: FormProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Crear proyecto</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={initialForm}
        onSubmit={(values) => {
          onSubmit(values);
        }}
        validationSchema={Yup.object({
          id_client: Yup.string().required("El cliente es requerido"),
          title: Yup.string().required("La descripción es requerida"),
          priority: Yup.string().required("La prioridad es requerida"),
          id_locality: Yup.string().required("La localidad es requerida"),
        })}
      >
        {({ errors, touched }) => (
          <Form id="form">
            <Modal.Body>
              <CustomInput.Select
                label="Cliente"
                name="id_client"
                placeholder="Seleccione un cliente"
                isInvalid={!!errors.id_client && touched.id_client}
                disabled={isFormSubmitting}
                isRequired
              >
                <option value="">Seleccione un cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.label}
                  </option>
                ))}
              </CustomInput.Select>

              <CustomInput.Text
                label="Título del proyecto"
                name="title"
                placeholder="Ejemplo: Cocina completa con isla y barra"
                isInvalid={!!errors.title && touched.title}
                disabled={isFormSubmitting}
                isRequired
              />

              <CustomInput.Select
                label="Localidad del proyecto"
                name="id_locality"
                placeholder="Seleccione una localidad"
                isInvalid={!!errors.id_locality && touched.id_locality}
                disabled={isFormSubmitting}
                isRequired
              >
                <option value="">Seleccione una localidad</option>
                {localities.map((locality) => (
                  <option key={locality.id} value={locality.id}>
                    {locality.label}
                  </option>
                ))}
              </CustomInput.Select>

              <CustomInput.Text
                label="Dirección del proyecto (opcional)"
                name="address"
                placeholder="Ingrese la dirección del proyecto"
                isInvalid={!!errors.address && touched.address}
                disabled={isFormSubmitting}
              />

              <CustomInput.Select
                label="Prioridad"
                name="priority"
                placeholder="Seleccione una prioridad"
                isInvalid={!!errors.priority && touched.priority}
                disabled={isFormSubmitting}
                isRequired
              >
                <option value="BAJA">BAJA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="ALTA">ALTA</option>
                <option value="URGENTE">URGENTE</option>
              </CustomInput.Select>
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
                  {isFormSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              </ButtonGroup>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
