import { useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
  ColumnOmitter,
  ColumnsHiddenInterface,
} from "../../shared";
import { LoadingSpinner } from "../../components";

import { EnvironmentListInterface as DataRow } from "./interfaces";

import {
  Form,
  Col,
  Row,
  InputGroup,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import apiSJM from "../../../api/apiSJM";
import {
  DesignStatusBadge,
  StatusBadge,
  PriorityBadge,
  DifficultyBadge,
} from "./components";
import { DateFormatter } from "../../helpers";

const columnsHidden = {
  id: { name: "ID", omit: false },
  client: { name: "CLIENTE", omit: false },
  type: { name: "AMBIENTE", omit: false },
  des_status: { name: "DISEÑO", omit: false },
  fab_status: { name: "FABRICACIÓN", omit: false },
  ins_status: { name: "INSTALACIÓN", omit: false },
  difficulty: { name: "DIFICULTAD", omit: true },
  priority: { name: "PRIORIDAD", omit: false },
  req_deadline: { name: "ENTREGA SOLICITADA", omit: true },
  est_deadline: { name: "ENTREGA ESTIMADA", omit: true },
};

export const Environments = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const [typesOfEnvironments, setTypesOfEnvironments] = useState([]);
  const endpoint = "/environments";

  const [omittedColumns, setOmittedColumns] =
    useState<ColumnsHiddenInterface>(columnsHidden);

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      setLoading(true);
      const [_, res2] = await Promise.all([
        fetchData(endpoint, 1, state, dispatch),
        apiSJM.get("/clients/select"),
      ]);
      setTypesOfEnvironments(res2.data.items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      return navigate("/");
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

  const handleFiltersChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "FILTERS_CHANGE", newFilters: state.filters });
    fetchData(endpoint, 1, state, dispatch);
  };

  const handleResetFilters = async () => {
    dispatch({ type: "RESET_FILTERS" });
    fetchData(endpoint, 1, initialState, dispatch);
  };

  useEffect(() => {
    if (state.error) {
      navigate("/");
    }
  }, [state.error]);

  // COLUMNAS Y RENDERIZADO
  const columns: TableColumn<DataRow>[] = useMemo(
    () => [
      {
        name: "ID",
        selector: (row: DataRow) => row.id,
        width: "80px",
        center: true,
        omit: omittedColumns.id.omit,
      },
      {
        name: "CLIENTE",
        selector: (row: DataRow) => row.client,
        maxWidth: "250px",
        wrap: true,
        omit: omittedColumns.client.omit,
      },
      {
        name: "AMBIENTE",
        selector: (row: DataRow) => row.type,
        cell: (row: DataRow) => (
          <span>
            <b>{row.type}</b>
            {", "}
            {row.project}
          </span>
        ),
        wrap: true,
        omit: omittedColumns.type.omit,
      },
      {
        name: "DISEÑO",
        selector: (row: DataRow) => row.des_status,
        cell: (row: DataRow) => <DesignStatusBadge status={row.des_status} />,
        center: true,
        maxWidth: "140px",
        omit: omittedColumns.des_status.omit,
      },
      {
        name: "FABRICACIÓN",
        selector: (row: DataRow) => row.fab_status,
        cell: (row: DataRow) => <StatusBadge status={row.fab_status} />,
        center: true,
        maxWidth: "140px",
        omit: omittedColumns.fab_status.omit,
      },
      {
        name: "INSTALACIÓN",
        selector: (row: DataRow) => row.ins_status,
        cell: (row: DataRow) => <StatusBadge status={row.ins_status} />,
        center: true,
        maxWidth: "140px",
        omit: omittedColumns.ins_status.omit,
      },
      {
        name: "DIFICULTAD",
        selector: (row: DataRow) => row.difficulty,
        cell: (row: DataRow) => <DifficultyBadge status={row.difficulty} />,
        center: true,
        maxWidth: "140px",
        omit: omittedColumns.difficulty.omit,
      },
      {
        name: "PRIORIDAD",
        selector: (row: DataRow) => row.priority,
        cell: (row: DataRow) => <PriorityBadge status={row.priority} />,
        center: true,
        maxWidth: "140px",
        omit: omittedColumns.priority.omit,
      },
      {
        name: "ENTREGA SOLICITADA",
        selector: (row: DataRow) =>
          row.req_deadline ? DateFormatter.toDMYYYY(row.req_deadline) : "",
        maxWidth: "160px",
        center: true,
        omit: omittedColumns.req_deadline.omit,
      },
      {
        name: "ENTREGA ESTIMADA",
        selector: (row: DataRow) =>
          row.est_deadline ? DateFormatter.toDMYYYY(row.est_deadline) : "",
        maxWidth: "160px",
        center: true,
        omit: omittedColumns.est_deadline.omit,
      },
    ],
    [omittedColumns]
  );

  const handleClick = (row: DataRow) => {
    navigate(`/ambientes/${row.id}`);
  };

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
            <Row>
              <Col xl={3}>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Text id="from">Cliente</InputGroup.Text>
                  <Form.Select
                    name="id_client"
                    size="sm"
                    value={state.filters.id_client || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "FILTERS_CHANGE",
                        newFilters: {
                          ...state.filters,
                          id_client: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Todos los clientes</option>
                    {typesOfEnvironments.map((type: any) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Col>

              <Col xl={3}>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Text id="from">Estado diseño</InputGroup.Text>
                  <Form.Select
                    name="des_status"
                    size="sm"
                    value={state.filters.des_status || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "FILTERS_CHANGE",
                        newFilters: {
                          ...state.filters,
                          des_status: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Todos los estados</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="PROCESO">EN PROCESO</option>
                    <option value="PAUSADO">EN PAUSA</option>
                    <option value="PRESENTADO">PRESENTADO AL CLIENTE</option>
                    <option value="CAMBIOS">REALIZANDO CAMBIOS</option>
                    <option value="FINALIZADO">FINALIZADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                  </Form.Select>
                </InputGroup>
              </Col>

              <Col xl={3}>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Text id="from">
                    Estado fabricación
                  </InputGroup.Text>
                  <Form.Select
                    name="fab_status"
                    size="sm"
                    value={state.filters.fab_status || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "FILTERS_CHANGE",
                        newFilters: {
                          ...state.filters,
                          fab_status: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Todos los estados</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="PROCESO">EN PROCESO</option>
                    <option value="PAUSADO">PAUSADO</option>
                    <option value="FINALIZADO">FINALIZADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                  </Form.Select>
                </InputGroup>
              </Col>

              <Col xl={3}>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Text id="from">
                    Estado instalación
                  </InputGroup.Text>
                  <Form.Select
                    name="ins_status"
                    size="sm"
                    value={state.filters.ins_status || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "FILTERS_CHANGE",
                        newFilters: {
                          ...state.filters,
                          ins_status: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Todos los estados</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="PROCESO">EN PROCESO</option>
                    <option value="PAUSADO">PAUSADO</option>
                    <option value="FINALIZADO">FINALIZADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                  </Form.Select>
                </InputGroup>
              </Col>

              <Col xl={3}>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Text id="from">Nivel dificultad</InputGroup.Text>
                  <Form.Select
                    name="difficulty"
                    size="sm"
                    value={state.filters.difficulty || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "FILTERS_CHANGE",
                        newFilters: {
                          ...state.filters,
                          difficulty: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Todos los niveles</option>
                    <option value="BAJA">BAJA</option>
                    <option value="MEDIA">MEDIA</option>
                    <option value="ALTA">ALTA</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col xl={3}>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Text id="from">Nivel prioridad</InputGroup.Text>
                  <Form.Select
                    name="priority"
                    size="sm"
                    value={state.filters.priority || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "FILTERS_CHANGE",
                        newFilters: {
                          ...state.filters,
                          priority: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Todos los niveles</option>
                    <option value="BAJA">BAJA</option>
                    <option value="MEDIA">MEDIA</option>
                    <option value="ALTA">ALTA</option>
                    <option value="URGENTE">URGENTE</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col xl={3}>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Text id="from">
                    Criterio ordenación
                  </InputGroup.Text>
                  <Form.Select
                    name="order_by"
                    size="sm"
                    value={state.filters.order_by || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "FILTERS_CHANGE",
                        newFilters: {
                          ...state.filters,
                          order_by: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="req_deadline_soon">
                      Entrega solicitada (más próxima)
                    </option>
                    <option value="req_deadline_late">
                      Entrega solicitada (más lejana)
                    </option>
                    <option value="est_deadline_soon">
                      Entrega estimada (más próxima)
                    </option>
                    <option value="est_deadline_late">
                      Entrega estimada (más lejana)
                    </option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col xl={3} className="mb-3">
                <ButtonGroup size="sm" className="d-flex">
                  <Button variant="primary" type="submit">
                    Buscar
                  </Button>
                  <Button variant="secondary" onClick={handleResetFilters}>
                    Limpiar
                  </Button>
                  <ColumnOmitter
                    omittedColumns={omittedColumns}
                    setOmittedColumns={setOmittedColumns}
                    py
                    icon={false}
                  />
                </ButtonGroup>
              </Col>
            </Row>
          </Form>
        </>
      )}

      <Datatable
        title="Listado de ambientes de proyectos"
        columns={columns as TableColumn<DataRow>[]}
        data={state.data}
        loading={state.loading}
        totalRows={state.totalRows}
        handleRowsPerPageChange={handleRowsPerPageChange}
        handlePageChange={handlePageChange}
        clickableRows
        onRowClicked={handleClick}
      />
    </div>
  );
};
