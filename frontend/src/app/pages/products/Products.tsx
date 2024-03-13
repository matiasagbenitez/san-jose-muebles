import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

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
  ideal_stock: number;
}

export const Products = () => {
  const navigate = useNavigate();
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
      name: "MARCA",
      selector: (row: DataRow) => row.brand,
      maxWidth: "160px",
      wrap: true,
    },
    {
      name: "CÓDIGO",
      selector: (row: DataRow) => row.code,
      maxWidth: "160px",
      wrap: true,
    },
    {
      name: "PRODUCTO",
      minWidth: "250px",
      wrap: true,
      selector: (row: DataRow) => row.name,
    },
    {
      name: <span className="py-1 text-center">STOCK MÍNIMO</span>,
      selector: (row: DataRow) =>
        row.min_stock > 0 ? row.min_stock + " " + row.unit : "",
      maxWidth: "150px",
      wrap: true,
      center: true,
    },
    {
      name: <span className="py-1 text-center">STOCK ACTUAL</span>,
      selector: (row: DataRow) => row.actual_stock + " " + row.unit,
      maxWidth: "150px",
      wrap: true,
      center: true,
    },
    {
      name: <span className="py-1 text-center">STOCK A RECIBIR</span>,
      selector: (row: DataRow) =>
        row.inc_stock > 0 ? row.inc_stock + " " + row.unit : "",
      maxWidth: "150px",
      wrap: true,
      center: true,
    },
    {
      name: <span className="py-1 text-center">STOCK TOTAL</span>,
      selector: (row: DataRow) =>
        row.inc_stock + row.actual_stock + " " + row.unit,
      conditionalCellStyles: [
        {
          when: (row) => row.inc_stock + row.actual_stock < row.min_stock,
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            color: "red",
            fontWeight: "bold",
          },
        },
      ],
      maxWidth: "150px",
      wrap: true,
      center: true,
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
