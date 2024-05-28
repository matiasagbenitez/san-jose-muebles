import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";

import { ProjectBasicData, UpdateProjectFormInterface } from "./interfaces";
import {
  CustomInput,
  LoadingSpinner,
  SimplePageHeader,
} from "../../components";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Button, Col, Row } from "react-bootstrap";
import { SweetAlert2 } from "../../utils";

export const UpdateProject = () => {
  // PARAMS
  const { id } = useParams();
  const navigate = useNavigate();

  // ESTADOS
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<ProjectBasicData>();
  const [localities, setLocalities] = useState([]);
  const [initialForm, setInitialForm] = useState<UpdateProjectFormInterface>();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        await apiSJM.get(`/projects/${id}/editable`),
        await apiSJM.get("/localities/list"),
      ]);
      setProject(res1.data.basic);
      setInitialForm(res1.data.initialForm);
      setLocalities(res2.data.localities);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return navigate("/proyectos");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const onSubmit = async (values: UpdateProjectFormInterface) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de editar este proyecto?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      setIsFormSubmitting(true);
      const { data } = await apiSJM.put(`/projects/${id}`, { ...values });
      SweetAlert2.successToast(data.message);
      navigate(`/proyectos/${id}`);
    } catch (error: any) {
      setIsFormSubmitting(false);
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && initialForm && project && localities && (
        <>
          <SimplePageHeader title="Editar proyecto" hr />

          <Formik
            initialValues={initialForm}
            onSubmit={(values) => {
              onSubmit(values);
            }}
            validationSchema={Yup.object({
              title: Yup.string().required("La descripción es requerida"),
              priority: Yup.string().required("La prioridad es requerida"),
              id_locality: Yup.string().required("La localidad es requerida"),
            })}
          >
            {({ errors, touched, setFieldValue }) => {
              const handleRequestDateChange = (e: any) => {
                setFieldValue("requested_deadline", e.target.value);
                setFieldValue("estimated_deadline", e.target.value);
              };

              return (
                <>
                  <Form id="form">
                    <Row>
                      <Col lg={4}>
                        <CustomInput.Text
                          label="Cliente"
                          name="client"
                          value={`${project.client}`}
                          disabled
                        />
                      </Col>

                      <Col lg={8}>
                        <CustomInput.Text
                          label="Título del proyecto"
                          name="title"
                          placeholder="Ejemplo: Cocina completa con isla y barra"
                          isInvalid={!!errors.title && touched.title}
                          disabled={isFormSubmitting}
                          isRequired
                        />
                      </Col>

                      <Col lg={4}>
                        <CustomInput.Select
                          label="Localidad del proyecto"
                          name="id_locality"
                          placeholder="Seleccione una localidad"
                          isInvalid={
                            !!errors.id_locality && touched.id_locality
                          }
                          disabled={isFormSubmitting}
                          isRequired
                        >
                          <option value="">Seleccione una localidad</option>
                          {localities.map((locality: any) => (
                            <option key={locality.id} value={locality.id}>
                              {locality.label}
                            </option>
                          ))}
                        </CustomInput.Select>
                      </Col>

                      <Col lg={4}>
                        <CustomInput.Text
                          label="Dirección del proyecto (opcional)"
                          name="address"
                          placeholder="Ingrese la dirección del proyecto"
                          isInvalid={!!errors.address && touched.address}
                          disabled={isFormSubmitting}
                        />
                      </Col>

                      <Col lg={4}>
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
                      </Col>

                      <h6 className="mt-3">
                        Información sobre fecha de entrega
                      </h6>
                      <Col lg={4}>
                        <CustomInput.Date
                          label="Fecha de entrega solicitada"
                          name="requested_deadline"
                          isInvalid={
                            !!errors.requested_deadline &&
                            touched.requested_deadline
                          }
                          disabled={isFormSubmitting}
                          onChange={(e: any) => handleRequestDateChange(e)}
                        />
                      </Col>
                      <Col lg={4}>
                        <CustomInput.Date
                          label="Fecha de entrega estimada"
                          name="estimated_deadline"
                          isInvalid={
                            !!errors.estimated_deadline &&
                            touched.estimated_deadline
                          }
                          disabled={isFormSubmitting}
                        />
                      </Col>
                    </Row>

                    <Button
                      type="submit"
                      variant="primary"
                      className="mt-3 float-end"
                      size="sm"
                      disabled={isFormSubmitting}
                    >
                      <i className="bi bi-floppy me-2"></i>
                      Guardar cambios
                    </Button>
                  </Form>
                </>
              );
            }}
          </Formik>
        </>
      )}
    </>
  );
};
