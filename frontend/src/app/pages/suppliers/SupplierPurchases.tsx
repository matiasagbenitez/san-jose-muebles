import { useState, useEffect, useReducer } from "react";
import { Badge, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";
import { TableColumn } from "react-data-table-component";
import { DayJsAdapter, toMoney } from "../../../helpers";

interface DataRow {
  id: number;
  created_at: Date;
  user: string;
  date: Date;
  currency: string;
  symbol: string;
  total: number;
  fully_stocked: boolean;
  nullified: boolean;
}

export const SupplierPurchases = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = `/purchases/by-supplier/${id}`;

  const [loading, setLoading] = useState(false);
  const [supplier, setSupplier] = useState<string>("");

  const fetch = async () => {
    try {
      setLoading(true);
      const [_, res2] = await Promise.all([
        fetchData(endpoint, 1, state, dispatch),
        apiSJM.get(`/suppliers/${id}`),
      ]);
      setSupplier(res2.data.supplier.name);
      setLoading(false);
    } catch (error) {
      console.error(error);
      navigate(`/proveedores/${id}`);
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleCreate = () => {
    navigate(`/compras/registrar`);
  };

  const handleClick = (row: DataRow) => {
    navigate(`/compras/${row.id}`);
  }

  const handlePageChange = async (page: number) => {
    dispatch({ type: "PAGE_CHANGE", page });
    fetchData(endpoint, page, state, dispatch);
  };

  const handleRowsPerPageChange = async (newPerPage: number, page: number) => {
    dispatch({ type: "ROWS_PER_PAGE_CHANGE", newPerPage, page });
    fetchData(endpoint, page, { ...state, perPage: newPerPage }, dispatch);
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
      selector: (row: DataRow) =>
        DayJsAdapter.toDayMonthYearHour(row.created_at),
      center: true,
    },
    {
      name: "RESPONSABLE",
      selector: (row: DataRow) => row.user,
      center: true,
    },
    {
      name: "FECHA COMPRA",
      selector: (row: DataRow) => DayJsAdapter.toDayMonthYear(row.date),
      center: true,
    },
    {
      name: "TOTAL COMPRA",
      selector: (row: DataRow) => row.total,
      right: true,
      format: (row: DataRow) => (
        <>
          <small className="text-muted">{row.symbol}</small>
          {"$ " + toMoney(row.total)}
        </>
      ),
    },
    {
      name: "STOCK",
      selector: (row: DataRow) => row.fully_stocked,
      format: (row: DataRow) => (
        <>
          {!row.nullified && (
            <Badge bg={row.fully_stocked ? "success" : "warning"}>
              {row.fully_stocked ? "COMPLETO" : "PENDIENTE"}
            </Badge>
          )}
        </>
      ),
      center: true,
    },
    {
      name: "VALIDEZ",
      selector: (row: DataRow) => row.nullified,
      format: (row: DataRow) => (
        <Badge bg={row.nullified ? "danger" : "success"}>
          {row.nullified ? "ANULADA" : "VALIDA"}
        </Badge>
      ),
      center: true,
    },
  ];

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-3 align-items-center">
              <Button
                variant="light border text-muted"
                size="sm"
                onClick={() => navigate(`/proveedores/${id}`)}
                title="Volver al detalle del proveedor"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Atrás
              </Button>
              <h1 className="fs-5 my-0">Compras realizadas a {supplier}</h1>
            </div>
            <Button size="sm" variant="success" onClick={handleCreate}>
              Nueva compra
            </Button>
          </div>
          <hr />

          <Datatable
            title="Listado de compras realizadas al proveedor"
            columns={columns as TableColumn<DataRow>[]}
            data={state.data}
            loading={state.loading}
            totalRows={state.totalRows}
            handleRowsPerPageChange={handleRowsPerPageChange}
            handlePageChange={handlePageChange}
            clickableRows
            onRowClicked={handleClick}
          />
        </>
      )}
    </>
  );
};
