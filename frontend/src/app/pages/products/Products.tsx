import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { useSelector } from "react-redux";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
  FilterByName,
} from "../../shared";

interface DataRow {
  id: number;
  brand: string;
  category: string;
  code: string;
  name: string;
  actual_stock: number;
  next_stock: number;
  min_stock: number;
  last_price: number;
  monetary: boolean;
  currency: number;
  next_stock_value: number;
}

export const Products = () => {
  const navigate = useNavigate();
  const { roles } = useSelector((state: any) => state.auth);
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = "/products";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    await fetchData(endpoint, 1, state, dispatch);
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
      name: "MARCA",
      selector: (row: DataRow) => row.brand,
      maxWidth: "140px",
      wrap: true,
      center: true,
    },
    {
      name: "CÓDIGO",
      selector: (row: DataRow) => row.code,
      maxWidth: "140px",
      wrap: true,
      center: true,
    },
    {
      name: "PRODUCTO",
      minWidth: "300px",
      wrap: true,
      selector: (row: DataRow) => row.name,
    },
    {
      name: "A RECIBIR",
      selector: (row: DataRow) => row.next_stock,
      maxWidth: "170px",
      wrap: true,
      center: true,
    },
    {
      name: "STOCK ACTUAL",
      selector: (row: DataRow) => row.actual_stock,
      conditionalCellStyles: [
        {
          when: (row) => row.actual_stock <= row.min_stock,
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            color: "red",
          },
        },
      ],
      maxWidth: "170px",
      wrap: true,
      center: true,
    },
    {
      name: "ÚLTIMO PRECIO",
      selector: (row: DataRow) =>
        `${row.currency} ${row.monetary ? "$" : ""} ${row.last_price}`,
      maxWidth: "170px",
      wrap: true,
      right: true,
      reorder: true,
      omit: !roles.includes("ADMIN"),
    },
    {
      name: "CAPITAL ACTUAL",
      selector: (row: DataRow) =>
        `${row.currency} ${row.monetary ? "$" : ""} ${row.next_stock_value}`,
      maxWidth: "170px",
      wrap: true,
      right: true,
      reorder: true,
      omit: !roles.includes("ADMIN"),
    },
  ];

  const handleClick = (row: DataRow) => {
    navigate(`/productos/${row.id}`);
  };

  const handleCreate = () => {
    navigate("/productos/nuevo");
  };

  return (
    <div>
      <FilterByName
        state={state}
        dispatch={dispatch}
        placeholder="Buscar por nombre de producto"
        handleFiltersChange={handleFiltersChange}
        handleResetFilters={handleResetFilters}
        handleCreate={handleCreate}
      />

      <Datatable
        title="Productos"
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
