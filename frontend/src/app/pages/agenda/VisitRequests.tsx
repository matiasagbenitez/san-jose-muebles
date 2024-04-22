import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import apiSJM from "../../../api/apiSJM";
import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
  FilterByName,
} from "../../shared";
import { SweetAlert2 } from "../../utils";
import { DayJsAdapter } from "../../../helpers";
import { VisitForm } from "./components";

interface DataRow {
  id: number;
  reason: string;
  reason_color: string;
  status: "PENDIENTE" | "REALIZADA" | "CANCELADA";
  priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE";
  client: string;
  locality: string;
  title: string;
  start: Date;
  end: Date;
}

export const VisitRequests = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const [localities, setLocalities] = useState([]);
  const [visitReasons, setVisitReasons] = useState([]);
  const [clients, setClients] = useState([]);
  const endpoint = "/visit_requests";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    const [_, res2, res3, res4] = await Promise.all([
      await fetchData(endpoint, 1, state, dispatch),
      await apiSJM.get("/localities/list"),
      await apiSJM.get("/visit_reasons/list"),
      await apiSJM.get("/clients/list"),
    ]);
    setLocalities(res2.data.localities);
    setVisitReasons(res3.data.visit_reasons);
    setClients(res4.data.clients);
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
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: any) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Está seguro de crear la visita?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      const { data } = await apiSJM.post(endpoint, formData);
      SweetAlert2.successToast(data.message);
      handleHide();
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
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
      selector: (row: DataRow) => DayJsAdapter.toDayMonthYear(row.start),
      center: true,
      maxWidth: "175px",
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
          style={{ fontSize: ".9em" }}
          className={`badge ${
            row.priority === "BAJA"
              ? "bg-secondary"
              : row.priority === "MEDIA"
              ? "bg-primary"
              : row.priority === "ALTA"
              ? "bg-warning"
              : "bg-danger"
          }`}
        >
          {row.priority}
        </span>
      ),
      center: true,
      maxWidth: "175px",
    },
    {
      name: "ESTADO",
      selector: (row: DataRow) => row.status,
      cell: (row: DataRow) => (
        <span
          style={{ fontSize: ".9em" }}
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
      maxWidth: "175px",
    },
  ];

  // MODAL
  const handleHide = () => {
    setIsModalOpen(false);
  };

  const handleClick = (row: DataRow) => {
    navigate(`/agenda/actividad/${row.id}`);
  };

  return (
    <div>
      <FilterByName
        state={state}
        dispatch={dispatch}
        placeholder="Buscar por nombre de cliente"
        handleFiltersChange={handleFiltersChange}
        handleResetFilters={handleResetFilters}
        handleCreate={handleCreate}
      />

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

      <VisitForm
        show={isModalOpen}
        onHide={handleHide}
        onSubmit={handleSubmit}
        localities={localities}
        visitReasons={visitReasons}
        clients={clients}
      />
    </div>
  );
};
