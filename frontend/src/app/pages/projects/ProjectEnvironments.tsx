import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, ButtonGroup, Card, Col, Modal, Row } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../api/apiSJM";

import { SweetAlert2 } from "../../utils";
import { DateFormatter } from "../../helpers";
import { CustomInput, LoadingSpinner, PageHeader } from "../../components";

import { ProjectBasicData } from "./interfaces";
import { ProjectHeader } from "./components";
import {
  DesignStatus,
  Difficulty,
  Priority,
  Status,
} from "../environments/interfaces";
import { DesignStatusSpan } from "../design/components";

interface DataRow {
  id: number;
  type: string;
  req_deadline: Date | null;
  est_deadline: Date | null;
  des_status: DesignStatus;
  fab_status: Status;
  ins_status: Status;
  difficulty: Difficulty;
  priority: Priority;
}

const initialForm = {
  id_type_of_environment: "",
  description: "",
  difficulty: "BAJA",
  priority: "BAJA",
  req_deadline: "",
  est_deadline: "",
};

export const ProjectEnvironments = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [project, setProject] = useState<ProjectBasicData | null>(null);
  const [environments, setEnvironments] = useState<DataRow[]>([]);
  const [typesOfEnvironments, setTypesOfEnvironments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const endpoint = `/environments/by-project/${id}`;

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    setLoading(true);
    try {
      const [res1, res2, res3] = await Promise.all([
        apiSJM.get(`/projects/${id}/basic`),
        apiSJM.get("/types_of_environments"),
        apiSJM.get(endpoint),
      ]);
      setProject(res1.data.item);
      setTypesOfEnvironments(res2.data.items);
      setEnvironments(res3.data.items);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: any) => {
    const message = `¿Desea crear el ambiente para el proyecto?`;
    const confirmation = await SweetAlert2.confirm(message);
    if (!confirmation.isConfirmed) return;

    try {
      setIsFormSubmitting(true);
      const { data } = await apiSJM.post("/environments", {
        ...formData,
        id_project: id,
      });
      SweetAlert2.successToast(data.message);
      handleHide();
      fetch();
    } catch (error: any) {
      console.log(error.response.data.message);
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // MODAL
  const handleHide = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <PageHeader
            title="Listado de ambientes del proyecto"
            actionButtonText="Nuevo ambiente"
            handleAction={handleCreate}
          />

          {project && <ProjectHeader project={project} showStatus={false} />}

          {environments.length == 0 ? (
            <p className="text-center mt-2 text-muted">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron ambientes registrados para este proyecto
            </p>
          ) : (
            <>
              <h6 className="mb-3">Listado de ambientes del proyecto</h6>
              {environments.map((env) => (
                <Link
                  title="Ver detalle del ambiente"
                  to={`/proyectos/${id}/ambientes/${env.id}`}
                  key={env.id}
                  className="text-decoration-none small"
                >
                  <Card className="mb-3">
                    <Card.Body className="py-2">
                      <Row>
                        <Col xs={12} xl={3} className="mb-2 mb-xl-0">
                          <b>
                            AMBIENTE N° {env.id} — {env.type}
                          </b>
                        </Col>
                        <Col xs={12} xl={3} className="mb-2 mb-xl-0">
                          <b className="me-2">DISEÑO:</b>
                          <DesignStatusSpan status={env.des_status} />
                        </Col>
                        <Col xs={12} xl={3} className="mb-2 mb-xl-0">
                          <b className="me-2">FABRICACIÓN:</b>
                          {env.fab_status}
                        </Col>
                        <Col xs={12} xl={3} className="mb-2 mb-xl-0">
                          <b className="me-2">INSTALACIÓN:</b>
                          {env.ins_status}
                        </Col>
                      </Row>
                      <hr className="my-2" />
                      <Row>
                        <Col xs={12} xl={6}>
                          <p className="mb-2 mb-xl-1">
                            <i className="bi bi-calendar me-2 fst-normal fw-bold" />
                            Fecha entrega solicitada:{" "}
                            {env.req_deadline
                              ? DateFormatter.toWDMYText(env.req_deadline)
                              : "no especificada"}
                          </p>
                          <p className="mb-2 mb-xl-1">
                            <i className="bi bi-calendar-check me-2 fst-normal fw-bold" />
                            Fecha entrega estimada:{" "}
                            {env.est_deadline
                              ? DateFormatter.toWDMYText(env.est_deadline)
                              : "no especificada"}
                          </p>
                        </Col>
                        <Col xs={12} xl={6}>
                          <p className="mb-2 mb-xl-1">
                            <i className="bi bi-info-circle me-2 fst-normal fw-bold" />
                            Dificultad:{" "}
                            <span className="text-muted">{env.difficulty}</span>
                          </p>
                          <p className="mb-2 mb-xl-1">
                            <i className="bi bi-info-circle me-2 fst-normal fw-bold" />
                            Prioridad:{" "}
                            <span className="text-muted">{env.priority}</span>
                          </p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Link>
              ))}
            </>
          )}

          <Modal show={isModalOpen} onHide={handleHide} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Registrar un nuevo ambiente</Modal.Title>
            </Modal.Header>

            <Formik
              initialValues={initialForm}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
              validationSchema={Yup.object({
                id_type_of_environment: Yup.string().required(
                  "El tipo de ambiente es requerido"
                ),
                difficulty: Yup.string().required("La dificultad es requerida"),
                priority: Yup.string().required("La prioridad es requerida"),
                description: Yup.string()
                  .required("La descripción es requerida")
                  .max(
                    2000,
                    "La descripción no puede superar los 2000 caracteres"
                  ),
                req_deadline: Yup.date().nullable(),
                est_deadline: Yup.date().nullable(),
              })}
            >
              {({ errors, touched }) => (
                <Form id="form">
                  <Modal.Body>
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
                  </Modal.Body>

                  <Modal.Footer>
                    <ButtonGroup size="sm">
                      <Button
                        variant="secondary"
                        disabled={isFormSubmitting}
                        onClick={handleHide}
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
        </>
      )}
    </>
  );
};
