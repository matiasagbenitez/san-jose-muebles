import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import apiSJM from "../../../api/apiSJM";
import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";
import { DayJsAdapter } from "../../../helpers";
import { Filters } from "./components";
import { LoadingSpinner } from "../../components";
import { VisitRequestListItemInterface as DataRow } from "./interfaces";

enum Priority {
  BAJA = "#B5D6A7",
  MEDIA = "#FFF47A",
  ALTA = "#FD9800",
  URGENTE = "#F55D1E",
}

export const VisitRequests = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const [clients, setClients] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [visitReasons, setVisitReasons] = useState([]);
  const endpoint = "/visit_requests";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    setLoading(true);
    const [_, res2, res3, res4] = await Promise.all([
      await fetchData(endpoint, 1, state, dispatch),
      await apiSJM.get("/clients/list"),
      await apiSJM.get("/localities/list"),
      await apiSJM.get("/visit_reasons/list"),
    ]);
    setClients(res2.data.clients);
    setLocalities(res3.data.localities);
    setVisitReasons(res4.data.visit_reasons);
    setLoading(false);
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

  const handleCreate = () => {
    navigate("/agenda/crear");
  };

  // COLUMNAS Y RENDERIZADO
  const columns: TableColumn<DataRow>[] = [
    {
      name: "ID",
      selector: (row: DataRow) => row.id,
      width: "80px",
      center: true,
    },
    {
      name: "FECHA PROGRAMADA",
      selector: (row: DataRow) =>
        row.schedule === "FULL_SCHEDULED"
          ? DayJsAdapter.toDayMonthYearHour(row.start!)
          : row.schedule === "PARTIAL_SCHEDULED"
          ? DayJsAdapter.toDayMonthYear(row.start!) 
          : "-",
      center: true,
      maxWidth: "160px",
      style: { fontWeight: "bold", backgroundColor: "#f0f0f0" },
    },
    {
      name: "ESTADO",
      selector: (row: DataRow) => row.status,
      cell: (row: DataRow) => (
        <span
          style={{ fontSize: ".9em", color: "black" }}
          className={`badge ${
            row.status === "PENDIENTE"
              ? "bg-warning"
              : row.status === "REALIZADA"
              ? "bg-success"
              : "bg-danger"
          }`}
        >
          {row.status}
        </span>
      ),
      center: true,
      maxWidth: "160px",
    },
    {
      name: "CLIENTE A VISITAR",
      selector: (row: DataRow) => row.client,
    },
    {
      name: "LOCALIDAD A VISITAR",
      selector: (row: DataRow) => row.locality,
    },
    {
      name: "MOTIVO DE LA VISITA",
      selector: (row: DataRow) => row.reason,
      cell: (row: DataRow) => <span>{row.reason}</span>,
    },
    {
      name: "PRIORIDAD",
      selector: (row: DataRow) => row.priority,
      cell: (row: DataRow) => (
        <span
          style={{
            fontSize: ".9em",
            backgroundColor: Priority[row.priority],
            color: "black",
          }}
          className={`badge`}
        >
          {row.priority}
        </span>
      ),
      center: true,
      maxWidth: "160px",
    },
  ];

  const handleClick = (row: DataRow) => {
    navigate(`/agenda/${row.id}`);
  };

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Filters
          state={state}
          dispatch={dispatch}
          handleFiltersChange={handleFiltersChange}
          handleResetFilters={handleResetFilters}
          handleCreate={handleCreate}
          clients={clients}
          localities={localities}
          visitReasons={visitReasons}
        />
      )}

      <Datatable
        title="Agenda de visitas"
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
