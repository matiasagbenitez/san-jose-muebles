import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Button, Modal } from "react-bootstrap";
import { MySelect, MyTextInput } from "../../../components/forms";

import { ProjectFormInterface } from "../interfaces";

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
}

export const CreateProjectModal = ({
  show,
  onHide,
  onSubmit,
  clients,
  localities,
}: FormProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <div className="p-4">
        <h1 className="fs-5">Registrar un nuevo proyecto</h1>
        <hr className="my-2" />

        <Formik
          initialValues={initialForm}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={Yup.object({
            id_client: Yup.string().required("El cliente es requerido"),
            priority: Yup.string().required("La prioridad es requerida"),
            id_locality: Yup.string().required("La localidad es requerida"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <MySelect
                label="Cliente"
                name="id_client"
                as="select"
                placeholder="Seleccione un cliente"
                isInvalid={!!errors.id_client && touched.id_client}
              >
                <option value="">Seleccione un cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.label}
                  </option>
                ))}
              </MySelect>

              <MyTextInput
                label="Breve descripción del proyecto"
                name="title"
                type="text"
                placeholder="Ejemplo: Cocina completa con isla y barra"
                isInvalid={!!errors.title && touched.title}
              />

              <MySelect
                label="Localidad del proyecto"
                name="id_locality"
                as="select"
                placeholder="Seleccione una localidad"
                isInvalid={!!errors.id_locality && touched.id_locality}
              >
                <option value="">Seleccione una localidad</option>
                {localities.map((locality) => (
                  <option key={locality.id} value={locality.id}>
                    {locality.label}
                  </option>
                ))}
              </MySelect>

              <MyTextInput
                label="Dirección del proyecto (opcional)"
                name="address"
                type="text"
                placeholder="Ingrese la dirección del proyecto"
                isInvalid={!!errors.address && touched.address}
              />

              <MySelect
                label="Prioridad"
                name="priority"
                as="select"
                placeholder="Seleccione una prioridad"
                isInvalid={!!errors.priority && touched.priority}
              >
                <option value="BAJA">BAJA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="ALTA">ALTA</option>
                <option value="URGENTE">URGENTE</option>
              </MySelect>

              <Button
                type="submit"
                variant="primary"
                className="mt-3 float-end"
                size="sm"
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
