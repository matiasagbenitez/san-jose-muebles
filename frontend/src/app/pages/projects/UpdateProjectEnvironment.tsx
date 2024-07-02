import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";

import { UpdateProjectEnvironmentFormInterface } from "./interfaces";
import {
  CustomInput,
  LoadingSpinner,
  SimplePageHeader,
} from "../../components";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Button, Col, Row } from "react-bootstrap";
import { SweetAlert2 } from "../../utils";

export const UpdateProjectEnvironment = () => {
  // PARAMS
  const { id: id_project, id_environment } = useParams();

  const navigate = useNavigate();

  // ESTADOS
  const [loading, setLoading] = useState(false);
  const [typesOfEnvironments, setTypesOfEnvironments] = useState([]);
  const [initialForm, setInitialForm] =
    useState<UpdateProjectEnvironmentFormInterface>();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        apiSJM.get(
          `/environments/${id_environment}/project/${id_project}/editable`
        ),
        apiSJM.get("/types_of_environments"),
      ]);
      console.log(res1);
      setInitialForm(res1.data.item);
      setTypesOfEnvironments(res2.data.items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return navigate("/proyectos");
    }
  };

  useEffect(() => {
    fetch();
  }, [id_project, id_environment]);

  const onSubmit = async (values: UpdateProjectEnvironmentFormInterface) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de editar este ambiente?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      setIsFormSubmitting(true);
      const { data } = await apiSJM.put(`/environments/${id_environment}`, values);
      SweetAlert2.successToast(data.message);
      navigate(`/proyectos/${id_project}/ambientes/${id_environment}`);
    } catch (error: any) {
      setIsFormSubmitting(false);
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && initialForm && typesOfEnvironments && (
        <>
          <SimplePageHeader title="Editar ambiente" hr />

          <Formik
            initialValues={initialForm}
            onSubmit={(values) => {
              onSubmit(values);
            }}
            validationSchema={Yup.object({
              id_project: Yup.number().required("El proyecto es requerido"),
              id_type_of_environment: Yup.string().required(
                "El tipo de ambiente es requerido"
              ),
              description: Yup.string().required("La descripción es requerida"),
              difficulty: Yup.string().required("La dificultad es requerida"),
              priority: Yup.string().required("La prioridad es requerida"),
            })}
          >
            {({ errors, touched, setFieldValue }) => {
              const handleRequestDateChange = (e: any) => {
                setFieldValue("req_deadline", e.target.value);
                setFieldValue("est_deadline", e.target.value);
              };

              return (
                <>
                  <Form id="form">
                    <Row>
                      <Col xs={12} lg={4}>
                        <CustomInput.Select
                          label="Tipo de ambiente"
                          name="id_type_of_environment"
                          isInvalid={
                            !!errors.id_type_of_environment &&
                            touched.id_type_of_environment
                          }
                          disabled={isFormSubmitting}
                          isRequired
                        >
                          <option value="">Seleccione una opción</option>
                          {typesOfEnvironments.map((type: any) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </CustomInput.Select>
                      </Col>
                      <Col xs={12} lg={4}>
                        <CustomInput.Select
                          label="Nivel de dificultad"
                          name="difficulty"
                          isInvalid={!!errors.difficulty && touched.difficulty}
                          disabled={isFormSubmitting}
                          isRequired
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="BAJA">Baja</option>
                          <option value="MEDIA">Media</option>
                          <option value="ALTA">Alta</option>
                        </CustomInput.Select>
                      </Col>
                      <Col xs={12} lg={4}>
                        <CustomInput.Select
                          label="Nivel de prioridad"
                          name="priority"
                          isInvalid={!!errors.priority && touched.priority}
                          disabled={isFormSubmitting}
                          isRequired
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="BAJA">Baja</option>
                          <option value="MEDIA">Media</option>
                          <option value="ALTA">Alta</option>
                          <option value="URGENTE">Urgente</option>
                        </CustomInput.Select>
                      </Col>
                      <Col xs={12}>
                        <CustomInput.TextArea
                          label="Descripción"
                          name="description"
                          placeholder="Ingrese una descripción del ambiente"
                          isInvalid={
                            !!errors.description && touched.description
                          }
                          disabled={isFormSubmitting}
                          rows={4}
                          isRequired
                        />
                      </Col>

                      <Col xs={6}>
                        <CustomInput.Date
                          label="Fecha de entrega solicitada"
                          name="req_deadline"
                          isInvalid={
                            !!errors.req_deadline && touched.req_deadline
                          }
                          disabled={isFormSubmitting}
                          onChange={handleRequestDateChange}
                        />
                      </Col>
                      <Col xs={6}>
                        <CustomInput.Date
                          label="Fecha de entrega estimada"
                          name="est_deadline"
                          isInvalid={
                            !!errors.est_deadline && touched.est_deadline
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
