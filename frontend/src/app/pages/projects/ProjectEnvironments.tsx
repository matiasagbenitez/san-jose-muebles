import { useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { Button, ButtonGroup, Col, Modal, Row } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../api/apiSJM";
import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";
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
import { DesignStatuses } from "../design/interfaces";

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
  const [state, dispatch] = useReducer(paginationReducer, initialState);

  const [project, setProject] = useState<ProjectBasicData | null>(null);
  const [typesOfEnvironments, setTypesOfEnvironments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const endpoint = `/environments/by-project/${id}`;

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    setLoading(true);
    try {
      const [_, res1, res2] = await Promise.all([
        fetchData(endpoint, 1, state, dispatch),
        apiSJM.get(`/projects/${id}/basic`),
        apiSJM.get("/types_of_environments"),
      ]);
      setProject(res1.data.item);
      setTypesOfEnvironments(res2.data.items);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handlePageChange = async (page: number) => {
    dispatch({ type: "PAGE_CHANGE", page });
    fetchData(endpoint, page, state, dispatch);
  };

  const handleRowsPerPageChange = async (newPerPage: number, page: number) => {
    dispatch({ type: "ROWS_PER_PAGE_CHANGE", newPerPage, page });
    fetchData(endpoint, page, { ...state, perPage: newPerPage }, dispatch);
  };

  useEffect(() => {
    if (state.error) {
      navigate("/");
    }
  }, [state.error]);

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

  // COLUMNAS Y RENDERIZADO
  const columns: TableColumn<DataRow>[] = useMemo(
    () => [
      {
        name: "ID",
        selector: (row: DataRow) => row.id,
        width: "80px",
        center: true,
      },
      {
        name: "AMBIENTE",
        selector: (row: DataRow) => row.type,
      },
      {
        name: "DISEÑO",
        selector: (row: DataRow) => row.des_status,
        cell: (row: DataRow) => (
          <span>
            <i className={DesignStatuses[row.des_status].icon} />
            {DesignStatuses[row.des_status].text}
          </span>
        ),
      },
      {
        name: "FABRICACIÓN",
        selector: (row: DataRow) => row.fab_status,
        center: true,
      },
      {
        name: "INSTALACIÓN",
        selector: (row: DataRow) => row.ins_status,
        center: true,
      },
      {
        name: "DIFICULTAD",
        selector: (row: DataRow) => row.difficulty,
        center: true,
      },
      {
        name: "PRIORIDAD",
        selector: (row: DataRow) => row.priority,
        center: true,
      },
      {
        name: "ENTREGA SOLICITADA",
        selector: (row: DataRow) =>
          row.req_deadline ? DateFormatter.toDMYYYY(row.req_deadline) : "",
        maxWidth: "200px",
        center: true,
      },
      {
        name: "ENTREGA ESTIMADA",
        selector: (row: DataRow) =>
          row.est_deadline ? DateFormatter.toDMYYYY(row.est_deadline) : "",
        maxWidth: "200px",
        center: true,
      },
    ],
    []
  );

  // MODAL
  const handleHide = () => {
    setIsModalOpen(false);
  };

  const handleClick = (row: DataRow) => {
    if (project) {
      navigate(`/proyectos/${project.id}/ambientes/${row.id}`);
    }
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

          <Datatable
            title="Listado de ambientes del proyecto"
            columns={columns as TableColumn<DataRow>[]}
            data={state.data}
            loading={state.loading}
            totalRows={state.totalRows}
            handleRowsPerPageChange={handleRowsPerPageChange}
            handlePageChange={handlePageChange}
            clickableRows
            onRowClicked={handleClick}
          />

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
