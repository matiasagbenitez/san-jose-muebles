import { useState, useEffect, useReducer } from "react";
import { Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, PageHeader } from "../../components";

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
  currency: {
    symbol: string;
    is_monetary: boolean;
  };
  total: number;
  fully_stocked: boolean;
  status: "VALIDA" | "ANULADA";
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
  };

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
          <small className="text-muted">{row.currency.symbol}</small>
          {row.currency.is_monetary && " $"}
          {toMoney(row.total)}
        </>
      ),
    },
    {
      name: "STOCK",
      selector: (row: DataRow) => row.fully_stocked,
      format: (row: DataRow) => (
        <>
          {row.status === "VALIDA" && (
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
      center: true,
    },
  ];

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <PageHeader
            goBackTo={`/proveedores/${id}`}
            goBackTitle="Volver al detalle del proveedor"
            title={`Compras realizadas a ${supplier}`}
            handleAction={handleCreate}
            actionButtonText="Nueva compra"
            hr={false}
            className="mb-3"
          />

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
