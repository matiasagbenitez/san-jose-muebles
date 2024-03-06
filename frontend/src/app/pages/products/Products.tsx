import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { useSelector } from "react-redux";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";

import { ProductsFilter } from "./components";
import apiSJM from "../../../api/apiSJM";

interface ParamsInterface {
  id: string;
  name: string;
}
interface DataRow {
  id: number;
  brand: string;
  category: string;
  unit: string;
  code: string;
  name: string;
  actual_stock: number;
  inc_stock: number;
  min_stock: number;
  last_price: number;
  monetary: boolean;
  currency: number;
  unit_name: string;
  actual_stock_value: number;
}

export const Products = () => {
  const navigate = useNavigate();
  const { roles } = useSelector((state: any) => state.auth);
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const [brands, setBrands] = useState<ParamsInterface[]>([]);
  const [categories, setCategories] = useState<ParamsInterface[]>([]);

  const endpoint = "/products";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    const [_, res2, res3] = await Promise.all([
      fetchData(endpoint, 1, state, dispatch),
      apiSJM.get("/brands"),
      apiSJM.get("/categories"),
    ]);
    setBrands(res2.data.items);
    setCategories(res3.data.items);
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
      name: "CÓDIGO",
      selector: (row: DataRow) => row.code,
      maxWidth: "140px",
      wrap: true,
    },
    {
      name: "MARCA",
      selector: (row: DataRow) => row.brand,
      maxWidth: "140px",
      wrap: true,
    },
    {
      name: "PRODUCTO",
      minWidth: "250px",
      wrap: true,
      selector: (row: DataRow) => row.name,
    },
    {
      name: "A RECIBIR",
      selector: (row: DataRow) => row.inc_stock + " " + row.unit,
      maxWidth: "170px",
      wrap: true,
      center: true,
    },
    {
      name: "STOCK ACTUAL",
      selector: (row: DataRow) => row.actual_stock + " " + row.unit,
      conditionalCellStyles: [
        {
          when: (row) => row.actual_stock < row.min_stock,
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            color: "red",
            fontWeight: "bold",
          },
        },
      ],
      maxWidth: "170px",
      wrap: true,
      center: true,
    },
    {
      name: "ÚLTIMO PRECIO",
      cell: (row: DataRow) => (
        <div className="d-flex justify-content-between align-items-center w-100">
          <span>{row.currency}</span>
          <span>
            {row.monetary ? "$" : ""} {row.last_price}
          </span>
        </div>
      ),
      maxWidth: "170px",
      wrap: true,
      right: true,
      reorder: true,
      omit: !roles.includes("ADMIN"),
    },
    {
      name: "POR",
      selector: (row: DataRow) => row.unit_name,
      width: "100px",
      center: true,
    },
    {
      name: "CAPITAL",
      cell: (row: DataRow) => (
        <div className="d-flex justify-content-between align-items-center w-100">
          <span>{row.currency}</span>
          <span>
            {row.monetary ? "$" : ""} {row.actual_stock_value}
          </span>
        </div>
      ),
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
      <ProductsFilter
        state={state}
        dispatch={dispatch}
        handleFiltersChange={handleFiltersChange}
        handleResetFilters={handleResetFilters}
        handleCreate={handleCreate}
        brands={brands}
        categories={categories}
      />

      <Datatable
        title="Listado de productos"
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
