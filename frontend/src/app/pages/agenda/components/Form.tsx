import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Col, Row } from "react-bootstrap";
import apiSJM from "../../../../api/apiSJM";

import { MySelect, MyTextInput } from "../../../components/forms";
import { VisitRequestFormInterface } from "../interfaces";

// import ReactDatePicker from "react-datepicker";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { addHours } from "date-fns";
registerLocale("es", es as any);

const visitForm: VisitRequestFormInterface = {
  id_visit_reason: "",
  status: "PENDIENTE",
  priority: "MEDIA",
  id_client: "",
  id_locality: "",
  address: "",

  notes: "",
  schedule: "NOT_SCHEDULED",
  start: new Date(),
  end: addHours(new Date(), 1),
};

interface ParamsInterface {
  id: string;
  label: string;
}

interface FormProps {
  editMode?: boolean;
  onSubmit: (values: any) => void;
  initialForm?: VisitRequestFormInterface;
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
    <>
      <Formik
        initialValues={initialForm}
        onSubmit={(values) => {
          if (values.schedule === "NOT_SCHEDULED") {
            values.start = null;
            values.end = null;
          } else if (values.schedule === "PARTIAL_SCHEDULED") {
            values.end = values.start;
          }
          onSubmit(values);
        }}
        validationSchema={Yup.object({
          id_visit_reason: Yup.string().required(
            "El motivo de visita es requerido"
          ),
          priority: Yup.string().required("La prioridad es requerida"),
          id_client: Yup.string().required("El cliente es requerido"),
          id_locality: Yup.string().required("La localidad es requerida"),

          schedule: Yup.string().required("El horario de visita es requerido"),
        })}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form id="form">
            <p className="fs-6 text-muted fw-bold mb-2">
              Información de la visita
            </p>
            <Row>
              <Col lg={4}>
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
              <Col lg={4}>
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

              <Col lg={4}>
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

              <Col lg={4}>
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

              <Col lg={8}>
                <MyTextInput
                  label="Dirección (opcional)"
                  name="address"
                  type="text"
                  placeholder="Ingrese la dirección"
                  isInvalid={!!errors.address && touched.address}
                />
              </Col>
              <Col>
                <MyTextInput
                  label="Notas adicionales (opcional)"
                  name="notes"
                  type="text"
                  placeholder="Ingrese notas adicionales"
                  isInvalid={!!errors.notes && touched.notes}
                />
              </Col>
            </Row>

            <br />

            <p className="fs-6 text-muted fw-bold mb-2">Horario de visita</p>
            <Row>
              <Col lg={4}>
                <MySelect
                  name="schedule"
                  isInvalid={!!errors.schedule && touched.schedule}
                >
                  <option value="NOT_SCHEDULED">
                    No definir día ni hora de visita
                  </option>
                  <option value="PARTIAL_SCHEDULED">
                    Definir únicamente día de visita
                  </option>
                  <option value="FULL_SCHEDULED">
                    Definir día y horario de visita
                  </option>
                </MySelect>

                {values.schedule === "PARTIAL_SCHEDULED" && (
                  <div className="py-3 d-flex flex-column">
                    <label htmlFor="ps_start" className="small fw-bold">
                      Día de visita
                    </label>
                    <DatePicker
                      id="ps_start"
                      name="start"
                      className="form-control w-100"
                      selected={values.start}
                      onChange={(date: Date) => setFieldValue("start", date)}
                      dateFormat="dd/MM/yyyy"
                      locale="es"
                      required
                      autoComplete="off"
                    />
                  </div>
                )}

                {values.schedule === "FULL_SCHEDULED" && (
                  <Row>
                    <Col xs={12}>
                      <div className="py-3 d-flex flex-column">
                        <label htmlFor="fs_start" className="small fw-bold">
                          Horario de inicio (desde)
                        </label>
                        <DatePicker
                          id="fs_start"
                          name="start"
                          className="form-control"
                          selected={values.start}
                          onChange={(date: Date) => {
                            setFieldValue("start", date);
                            setFieldValue("end", addHours(date, 1));
                          }}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={30}
                          timeCaption="Hora"
                          dateFormat="dd/MM/yyyy HH:mm"
                          locale="es"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="pb-2 d-flex flex-column">
                        <label htmlFor="fs_end" className="small fw-bold">
                          Horario de fin (hasta)
                        </label>
                        <DatePicker
                          id="fs_end"
                          name="end"
                          className="form-control"
                          selected={values.end}
                          onChange={(date: Date) => setFieldValue("end", date)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={30}
                          timeCaption="Hora"
                          dateFormat="dd/MM/yyyy HH:mm"
                          locale="es"
                          minDate={values.start}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </Col>
                  </Row>
                )}
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
    </>
  );
};
