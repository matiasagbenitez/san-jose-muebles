import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { toMoney, DayJsAdapter } from "../../../helpers";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";

import apiSJM from "../../../api/apiSJM";
import { Badge } from "react-bootstrap";
import { Filters } from "./components";

interface ParamsInterface {
  id: string;
  name: string;
}
interface DataRow {
  id: number;
  created_at: Date;
  date: Date;
  supplier: string;
  currency: {
    symbol: string;
    is_monetary: boolean;
  };
  total: number;
  fully_stocked: boolean;
  status: "ANULADA" | "VIGENTE";
}

export const Purchases = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const [suppliers, setSuppliers] = useState<ParamsInterface[]>([]);

  const endpoint = "/purchases";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    const [_, res2] = await Promise.all([
      fetchData(endpoint, 1, state, dispatch),
      apiSJM.get("/suppliers/select"),
    ]);
    setSuppliers(res2.data.items);
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
  const columns: TableColumn<DataRow>[] = [
    {
      name: "ID",
      selector: (row: DataRow) => row.id,
      width: "80px",
      center: true,
    },
    {
      name: "FECHA REGISTRO",
      selector: (row: DataRow) => row.created_at as any,
      format: (row: DataRow) => DayJsAdapter.toDayMonthYearHour(row.created_at),
      maxWidth: "150px",
      center: true,
    },
    {
      name: "FECHA COMPRA",
      selector: (row: DataRow) => row.date as any,
      format: (row: DataRow) => DayJsAdapter.toDayMonthYear(row.date),
      maxWidth: "150px",
      center: true,
    },
    {
      name: "PROVEEDOR",
      selector: (row: DataRow) => row.supplier,
      wrap: true,
    },
    {
      name: "TOTAL COMPRA",
      selector: (row: DataRow) => row.total,
      format: (row: DataRow) => (
        <>
          <small className="text-muted">{row.currency.symbol}</small>
          {row.currency.is_monetary && " $"}
          {toMoney(row.total)}
        </>
      ),
      maxWidth: "175px",
      wrap: true,
      right: true,
    },
    {
      name: "STOCK",
      selector: (row: DataRow) => row.fully_stocked,
      format: (row: DataRow) => (
        <>
          {row.status === "VIGENTE" && (
            <Badge
              bg={row.fully_stocked ? "success" : "warning"}
              className="rounded-pill"
              style={{ fontSize: ".9em" }}
            >
              {row.fully_stocked ? "COMPLETO" : "PENDIENTE"}
            </Badge>
          )}
        </>
      ),
      maxWidth: "175px",
      center: true,
    },
    {
      name: "ESTADO",
      selector: (row: DataRow) => row.status,
      format: (row: DataRow) => (
        <Badge
          bg={row.status === "ANULADA" ? "danger" : "success"}
          className="rounded-pill"
          style={{
            fontSize: ".9em",
          }}
        >
          {row.status}
        </Badge>
      ),
      maxWidth: "175px",
      center: true,
    },
  ];

  const handleClick = (row: DataRow) => {
    navigate(`/compras/${row.id}`);
  };

  const handleCreate = () => {
    navigate("/compras/registrar");
  };

  return (
    <div>
      <Filters
        state={state}
        dispatch={dispatch}
        handleFiltersChange={handleFiltersChange}
        handleResetFilters={handleResetFilters}
        handleCreate={handleCreate}
        suppliers={suppliers}
      />

      <Datatable
        title="Listado de compras"
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
