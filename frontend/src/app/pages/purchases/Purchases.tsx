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
import { Badge } from "react-bootstrap";

interface ParamsInterface {
  id: string;
  name: string;
}
interface DataRow {
  id: number;
  created_at: string;
  date: string;
  supplier: string;
  total: string;
  payed_off: boolean;
  payed_status: string;
  payed_message: string;
  fully_stocked: boolean;
  nullified: boolean;
}

export const Purchases = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const [brands, setBrands] = useState<ParamsInterface[]>([]);
  const [categories, setCategories] = useState<ParamsInterface[]>([]);

  const endpoint = "/purchases";

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
      name: "FECHA REGISTRO",
      selector: (row: DataRow) => row.created_at,
      maxWidth: "140px",
      center: true,
    },
    {
      name: "FECHA COMPRA",
      selector: (row: DataRow) => row.date,
      maxWidth: "140px",
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
      maxWidth: "200px",
      wrap: true,
      right: true,
    },
    {
      name: "ESTADO CUENTA",
      selector: (row: DataRow) => row.payed_off,
      format: (row: DataRow) => (
        <Badge bg={row.payed_off ? "success" : "warning"}>
          {row.payed_off ? "PAGADO" : "PENDIENTE"}
        </Badge>
      ),
      maxWidth: "150px",
      center: true,
    },
    {
      name: "STOCK RECIBIDO",
      selector: (row: DataRow) => row.fully_stocked,
      format: (row: DataRow) => (
        <Badge bg={row.fully_stocked ? "success" : "warning"}>
          {row.fully_stocked ? "COMPLETO" : "INCOMPLETO"}
        </Badge>
      ),
      maxWidth: "150px",
      center: true,
    },
    {
      name: "VALIDEZ",
      selector: (row: DataRow) => row.nullified,
      format: (row: DataRow) => (
        <Badge bg={row.nullified ? "danger" : "success"}>
          {row.nullified ? "ANULADO" : "VIGENTE"}
        </Badge>
      ),
      maxWidth: "120px",
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
