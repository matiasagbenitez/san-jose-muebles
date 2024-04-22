import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Col, Row } from "react-bootstrap";
import apiSJM from "../../../../api/apiSJM";

import {
  MyInputDatetime,
  MySelect,
  MyTextArea,
  MyTextInput,
} from "../../../components/forms";
import { VisitFormInterface } from "../interfaces";

const visitForm: VisitFormInterface = {
  id_visit_reason: "",
  visible_for: "ALL",
  status: "PENDIENTE",
  priority: "MEDIA",
  id_client: "",
  id_locality: "",
  address: "",
  title: "",
  description: "",
  start: "" as any,
  end: "" as any,
};

interface ParamsInterface {
  id: string;
  label: string;
}

interface FormProps {
  editMode?: boolean;
  onSubmit: (values: any) => void;
  initialForm?: VisitFormInterface;
}

export const VisitForm = ({
  editMode = false,
  onSubmit,
  initialForm = visitForm,
}: FormProps) => {
  const [clients, setClients] = useState<ParamsInterface[]>([]);
  const [visitReasons, setVisitReasons] = useState<ParamsInterface[]>([]);
  const [localities, setLocalities] = useState<ParamsInterface[]>([]);

  const fetchData = async () => {
    const [res1, res2, res3] = await Promise.all([
      apiSJM.get("/clients/list"),
      apiSJM.get("/visit_reasons/list"),
      apiSJM.get("/localities/list"),
    ]);
    setClients(res1.data.clients);
    setVisitReasons(res2.data.visit_reasons);
    setLocalities(res3.data.localities);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-">
      <h1 className="fs-5">
        {editMode ? "Modificar visita" : "Registrar nueva visita"}
      </h1>
      <hr className="my-2" />

      <Formik
        initialValues={initialForm}
        onSubmit={(values) => {
          onSubmit(values);
        }}
        validationSchema={Yup.object({
          id_client: Yup.string().required("El cliente es requerido"),
          id_visit_reason: Yup.string().required(
            "El motivo de visita es requerido"
          ),
          id_locality: Yup.string().required("La localidad es requerida"),
          title: Yup.string().required("El título es requerido"),
          start: Yup.date().required("La fecha de inicio es requerida"),
          end: Yup.date().required("La fecha de fin es requerida"),
        })}
      >
        {({ errors, touched }) => (
          <Form id="form">
            <b className="fs-6 text-muted">Información general</b>
            <Row>
              <Col md={6}>
                <MySelect
                  label="Cliente a visitar"
                  name="id_client"
                  as="select"
                  isInvalid={!!errors.id_client && touched.id_client}
                >
                  <option value="">Seleccione un cliente</option>
                  {clients &&
                    clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.label}
                      </option>
                    ))}
                </MySelect>
              </Col>
              <Col md={6}>
                <MySelect
                  label="Motivo de visita"
                  name="id_visit_reason"
                  as="select"
                  isInvalid={
                    !!errors.id_visit_reason && touched.id_visit_reason
                  }
                >
                  <option value="">Seleccione un motivo de visita</option>
                  {visitReasons &&
                    visitReasons.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                </MySelect>
              </Col>

              <Col md={6}>
                <MySelect
                  label="Localidad a visitar"
                  name="id_locality"
                  as="select"
                  isInvalid={!!errors.id_locality && touched.id_locality}
                >
                  <option value="">Seleccione una localidad</option>
                  {localities &&
                    localities.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                </MySelect>
              </Col>

              <Col md={6}>
                <MyTextInput
                  label="Dirección (opcional)"
                  name="address"
                  type="text"
                  placeholder="Ingrese la dirección"
                  isInvalid={!!errors.address && touched.address}
                />
              </Col>
            </Row>
            <br />

            <b className="fs-6 text-muted">Información de la visita</b>
            <Row>
              <Col md={9}>
                <MyTextInput
                  label="Título de la visita (opcional)"
                  name="title"
                  type="text"
                  placeholder="Ingrese un título"
                  isInvalid={!!errors.title && touched.title}
                />
              </Col>
              <Col md={3}>
                <MySelect
                  label="Prioridad"
                  name="priority"
                  as="select"
                  isInvalid={!!errors.priority && touched.priority}
                >
                  <option value="BAJA">BAJA</option>
                  <option value="MEDIA">MEDIA</option>
                  <option value="ALTA">ALTA</option>
                  <option value="URGENTE">URGENTE</option>
                </MySelect>
              </Col>
              <Col xs={12}>
                <MyTextArea
                  label="Descripción (opcional)"
                  name="description"
                  placeholder="Ingrese anotaciones adicionales"
                  rows={3}
                  isInvalid={!!errors.description && touched.description}
                />
              </Col>
              <Col md={6}>
                <MyInputDatetime
                  label="Fecha de inicio"
                  name="start"
                  isInvalid={!!errors.start && touched.start}
                />
              </Col>
              <Col md={6}>
                <MyInputDatetime
                  label="Fecha de fin"
                  name="end"
                  isInvalid={!!errors.end && touched.end}
                />
              </Col>
            </Row>

            <Button
              type="submit"
              variant="primary"
              className="mt-3 float-end"
              size="sm"
            >
              {editMode ? "Modificar visita" : "Registrar visita"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
