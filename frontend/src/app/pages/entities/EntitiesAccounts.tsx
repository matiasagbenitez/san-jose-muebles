import { useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";

import apiSJM from "../../../api/apiSJM";
import { DateFormatter, NumberFormatter } from "../../helpers";
import { Button, ButtonGroup, Col, Row, Form } from "react-bootstrap";

interface ParamsInterface {
  id: string;
  name: string;
}

interface DataRow {
  id: number;
  entity: {
    id: string;
    name: string;
  };
  currency: {
    name: string;
    symbol: string;
    is_monetary: boolean;
  };
  balance: number;
  updatedAt: Date;
}

export const EntitiesAccounts = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const [currencies, setCurrencies] = useState<ParamsInterface[]>([]);
  const [entities, setEntities] = useState<ParamsInterface[]>([]);

  const endpoint = "/entity_accounts";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      const [_, res2, res3] = await Promise.all([
        fetchData(endpoint, 1, state, dispatch),
        apiSJM.get("/currencies/monetaries"),
        apiSJM.get("/entities/select"),
      ]);
      setCurrencies(res2.data.items);
      setEntities(res3.data.items);
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
        name: "ENTIDAD",
        selector: (row: DataRow) => row.entity.name,
        wrap: true,
      },
      {
        name: "MONEDA CUENTA",
        selector: (row: DataRow) => row.currency.name,
        format: (row: DataRow) => (
          <span>
            {row.currency.name} ({row.currency.symbol})
          </span>
        ),
        wrap: true,
      },
      {
        name: "SALDO ACTUAL",
        selector: (row: DataRow) => row.balance,
        cell: (row: DataRow) => (
          <>
            <small className="text-muted me-1">{row.currency.symbol}</small>
            <b
              style={{ fontSize: "1.1em" }}
              className={`text-${
                row.balance > 0
                  ? "success"
                  : row.balance < 0
                  ? "danger"
                  : "secondary"
              }`}
            >
              {NumberFormatter.formatSignedCurrency(
                row.currency.is_monetary,
                row.balance
              )}
            </b>
          </>
        ),
        right: true,
        maxWidth: "200px",
        style: { fontWeight: "bold", backgroundColor: "#f0f0f0" },
      },
      {
        name: "ÚLTIMO MOVIMIENTO",
        maxWidth: "200px",
        center: true,
        selector: (row: DataRow) => DateFormatter.toDMYH(row.updatedAt),
      },
    ],
    []
  );

  const handleClick = (row: DataRow) => {
    navigate(`/entidades/${row.entity.id}/cuentas/${row.id}`);
  };

  return (
    <div>
      <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
        <Row>
          <Col xl={9}>
            <Row>
              <Col xl={4}>
                <Form.Select
                  name="supplier"
                  size="sm"
                  value={state.filters.id_entity || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "FILTERS_CHANGE",
                      newFilters: {
                        ...state.filters,
                        id_entity: e.target.value,
                      },
                    })
                  }
                  className="mb-3"
                >
                  <option value="">Todas las entidades</option>
                  {entities.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col xl={4}>
                <Form.Select
                  name="currency"
                  size="sm"
                  value={state.filters.id_currency || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "FILTERS_CHANGE",
                      newFilters: {
                        ...state.filters,
                        id_currency: e.target.value,
                      },
                    })
                  }
                  className="mb-3"
                >
                  <option value="">Todas las monedas</option>
                  {currencies.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col xl={4}>
                <Form.Select
                  size="sm"
                  className="mb-3"
                  name="balance"
                  value={state.filters.balance || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "FILTERS_CHANGE",
                      newFilters: { ...state.filters, balance: e.target.value },
                    })
                  }
                >
                  <option value="">Todos los estados</option>
                  <option value="positive">Cuentas con saldo a favor</option>
                  <option value="negative">Cuentas con saldo negativo</option>
                  <option value="zero">Cuentas con saldo en cero</option>
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
            </ButtonGroup>
          </Col>
        </Row>
      </Form>

      <Datatable
        title="Listado de cuentas corrientes de entidades"
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
