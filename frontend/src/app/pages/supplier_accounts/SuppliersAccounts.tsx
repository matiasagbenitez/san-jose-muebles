import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";

import apiSJM from "../../../api/apiSJM";
import { SuppliersAccountsFilters } from "./components";
import { DateFormatter, NumberFormatter } from "../../helpers";

interface ParamsInterface {
  id: string;
  name: string;
}

interface DataRow {
  id: number;
  supplier: string;
  currency: {
    name: string;
    symbol: string;
    is_monetary: boolean;
  };
  balance: number;
  updatedAt: Date;
}

export const SuppliersAccounts = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const [currencies, setCurrencies] = useState<ParamsInterface[]>([]);
  const [suppliers, setSuppliers] = useState<ParamsInterface[]>([]);

  const endpoint = "/supplier_accounts";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    const [_, res2, res3] = await Promise.all([
      fetchData(endpoint, 1, state, dispatch),
      apiSJM.get("/currencies/monetaries"),
      apiSJM.get("/suppliers/select"),
    ]);
    setCurrencies(res2.data.items);
    setSuppliers(res3.data.items);
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
      name: "CUENTA CORRIENTE",
      selector: (row: DataRow) =>
        row.supplier + " - CUENTA CORRIENTE EN " + row.currency.name,
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
      wrap: true,
      right: true,
      maxWidth: "200px",
      style: { fontWeight: "bold", backgroundColor: "#f0f0f0" },
    },
    {
      name: "ÚLTIMO MOVIMIENTO",
      maxWidth: "250px",
      center: true,
      selector: (row: DataRow) => DateFormatter.toDMYH(row.updatedAt),
    },
  ];

  const handleClick = (row: DataRow) => {
    navigate(`/cuentas-proveedores/${row.id}`);
  };

  return (
    <div>
      <SuppliersAccountsFilters
        state={state}
        dispatch={dispatch}
        handleFiltersChange={handleFiltersChange}
        handleResetFilters={handleResetFilters}
        currencies={currencies}
        suppliers={suppliers}
      />

      <Datatable
        title="Listado de cuentas corrientes de proveedores"
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
