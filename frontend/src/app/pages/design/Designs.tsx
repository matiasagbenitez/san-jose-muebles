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
import { DesignList as DataRow, DesignStatuses } from "./interfaces";
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

export const Designs = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = "/designs";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      setLoading(true);
      await fetchData(endpoint, 1, state, dispatch), setLoading(false);
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
        wrap: true,
      },
      {
        name: "AMBIENTE",
        selector: (row: DataRow) => row.environment,
        wrap: true,
      },
      {
        name: "PROYECTO",
        selector: (row: DataRow) => row.project,
        wrap: true,
      },

      {
        name: "ESTADO",
        selector: (row: DataRow) => row.status,
        cell: (row: DataRow) => (
          <b>
            <i className={DesignStatuses[row.status].icon} />
            {DesignStatuses[row.status].text}
          </b>
        ),
        wrap: true,
      },
    ],
    []
  );

  const handleClick = (row: DataRow) => {
    navigate(`/disenos/${row.id}`);
  };

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
          <Row>
            <Col xl={9}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="from">Estado del diseño</InputGroup.Text>
                <Form.Select
                  name="status"
                  size="sm"
                  value={state.filters.status || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "FILTERS_CHANGE",
                      newFilters: {
                        ...state.filters,
                        status: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">Por defecto</option>
                  <option value="PENDIENTE">PENDIENTES</option>
                  <option value="PROCESO">EN PROCESO</option>
                  <option value="PAUSADO">EN PAUSA</option>
                  <option value="PRESENTAR">PARA PRESENTAR</option>
                  <option value="PRESENTADO">PRESENTADOS AL CLIENTE</option>
                  <option value="REVISION">REVISIÓN / CAMBIOS</option>
                  <option value="FINALIZADO">FINALIZADOS</option>
                  <option value="CANCELADO">CANCELADOS</option>
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
              </ButtonGroup>
            </Col>
          </Row>
        </Form>
      )}

      <Datatable
        title="Listado de diseños"
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
