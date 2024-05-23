import { useEffect, useMemo, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";

import { DateFormatter } from "../../helpers";
import { Button, ButtonGroup, Col, Form, Row } from "react-bootstrap";

interface DataRow {
  id: number;
  type: "INCREMENT" | "DECREMENT";
  description: string;
  total_items: number;
  username: string;
  created_at: Date;
}

export const Lots = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = "/stock_lots";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      fetchData(endpoint, 1, state, dispatch);
    } catch (error) {
      console.error(error);
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
        name: "FECHA REGISTRO",
        selector: (row: DataRow) => DateFormatter.toDMYH(row.created_at),
        maxWidth: "150px",
        wrap: true,
        center: true,
      },
      {
        name: "RESPONSABLE",
        selector: (row: DataRow) => row.username,
        maxWidth: "150px",
        wrap: true,
        center: true,
      },
      {
        name: "TIPO DE AJUSTE",
        maxWidth: "150px",
        wrap: true,
        selector: (row: DataRow) => row.type,
        format: (row: DataRow) => (
          <span
            className={`badge rounded-pill ${
              row.type === "INCREMENT" ? "bg-success" : "bg-danger"
            }`}
          >
            {row.type === "INCREMENT" ? "INCREMENTO" : "DECREMENTO"}
          </span>
        ),
        center: true,
      },
      {
        name: "DESCRIPCIÓN",
        selector: (row: DataRow) => row.description,
        wrap: true,
      },
      {
        name: "PRODUCTOS AJUSTADOS",
        selector: (row: DataRow) => row.total_items,
        maxWidth: "200px",
        wrap: true,
        center: true,
      },
    ],
    []
  );

  const handleClick = (row: DataRow) => {
    navigate(`/productos/ajustes/${row.id}`);
  };

  const handleCreate = () => {
    navigate("/productos/ajustes/nuevo");
  };

  return (
    <div>
      <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
        <Row>
          <Col xl={9}>
            <Row>
              <Col xl={6}>
                <Form.Control
                  name="description"
                  autoComplete="off"
                  size="sm"
                  type="description"
                  placeholder="Filtrar por descripción"
                  value={state.filters.description || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "FILTERS_CHANGE",
                      newFilters: {
                        ...state.filters,
                        description: e.target.value,
                      },
                    })
                  }
                  className="mb-3"
                />
              </Col>

              <Col xl={6}>
                <Form.Select
                  name="type"
                  size="sm"
                  value={state.filters.type || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "FILTERS_CHANGE",
                      newFilters: {
                        ...state.filters,
                        type: e.target.value,
                      },
                    })
                  }
                  className="mb-3"
                >
                  <option value="">Todos los tipos de ajuste</option>
                  <option value="INCREMENT">INCREMENTO DE STOCK</option>
                  <option value="DECREMENT">DECREMENTO DE STOCK</option>
                </Form.Select>
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
              <Button variant="success" onClick={handleCreate}>
                Nuevo
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>

      <Datatable
        title="Listado de ajustes de stock"
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
