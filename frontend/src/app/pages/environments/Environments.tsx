import { useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";
import { LoadingSpinner } from "../../components";

import {
  EnvironmentListInterface as DataRow,
  DesignStatusColor,
  StatusColor,
} from "./interfaces";

import {
  Form,
  Col,
  Row,
  InputGroup,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import apiSJM from "../../../api/apiSJM";

export const Environments = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const [typesOfEnvironments, setTypesOfEnvironments] = useState([]);
  const endpoint = "/environments";

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
      },
      {
        name: "CLIENTE",
        selector: (row: DataRow) => row.client,
        maxWidth: "250px",
      },
      {
        name: "PROYECTO",
        selector: (row: DataRow) => row.project,
      },
      {
        name: "TIPO AMBIENTE",
        selector: (row: DataRow) => row.type,
      },
      {
        name: "DISEÑO",
        selector: (row: DataRow) => row.des_status,
        cell: (row: DataRow) => (
          <span
            className="badge rounded-pill"
            style={{
              fontSize: ".9em",
              color: "black",
              backgroundColor: DesignStatusColor[row.des_status],
            }}
          >
            {row.des_status}
          </span>
        ),
        center: true,
        maxWidth: "160px",
      },
      {
        name: "FABRICACIÓN",
        selector: (row: DataRow) => row.fab_status,
        cell: (row: DataRow) => (
          <span
            className="badge rounded-pill"
            style={{
              fontSize: ".9em",
              color: "black",
              backgroundColor: StatusColor[row.fab_status],
            }}
          >
            {row.fab_status}
          </span>
        ),
        center: true,
        maxWidth: "160px",
      },
      {
        name: "INSTALACIÓN",
        selector: (row: DataRow) => row.ins_status,
        cell: (row: DataRow) => (
          <span
            className="badge rounded-pill"
            style={{
              fontSize: ".9em",
              color: "black",
              backgroundColor: StatusColor[row.ins_status],
            }}
          >
            {row.ins_status}
          </span>
        ),
        center: true,
        maxWidth: "160px",
      },
    ],
    []
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
              <Col xl={9}>
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
                        <option value="">Todos</option>
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
                      <InputGroup.Text id="from">
                        Diseño
                      </InputGroup.Text>
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
                        <option value="">Todos</option>
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="PROCESO">EN PROCESO</option>
                        <option value="PAUSADO">EN PAUSA</option>
                        <option value="PRESENTADO">
                          PRESENTADO AL CLIENTE
                        </option>
                        <option value="MODIFICANDO">MODIFICANDO</option>
                        <option value="FINALIZADO">FINALIZADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                      </Form.Select>
                    </InputGroup>
                  </Col>

                  <Col xl={3}>
                    <InputGroup size="sm" className="mb-3">
                      <InputGroup.Text id="from">
                        Fabricación
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
                        <option value="">Todos</option>
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
                        Instalación
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
                        <option value="">Todos</option>
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="PROCESO">EN PROCESO</option>
                        <option value="PAUSADO">PAUSADO</option>
                        <option value="FINALIZADO">FINALIZADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                      </Form.Select>
                    </InputGroup>
                  </Col>
                </Row>
              </Col>

              <Col xl={3} className="mb-3">
                <ButtonGroup size="sm" className="d-flex">
                  <Button variant="primary" type="submit">
                    Buscar
                  </Button>
                  <Button variant="secondary" onClick={handleResetFilters}>
                    Limpiar
                  </Button>
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
