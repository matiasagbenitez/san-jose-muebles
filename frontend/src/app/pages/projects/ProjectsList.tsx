import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import apiSJM from "../../../api/apiSJM";
import { Datatable, initialState, paginationReducer, fetchData } from "../../shared";
import { LoadingSpinner } from "../../components";
import { ProjectListable as DataRow, Priorities, ProjectFormInterface, Statuses } from "./interfaces";
import { CreateProjectModal, Filters } from "./components";
import { SweetAlert2 } from "../../utils";
// import { DayJsAdapter } from "../../../helpers";

export const ProjectsList = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = "/projects";

  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [localities, setLocalities] = useState([]);

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    setLoading(true);
    const [_, res2, res3] = await Promise.all([
      await fetchData(endpoint, 1, state, dispatch),
      await apiSJM.get("/clients/list"),
      await apiSJM.get("/localities/list"),
    ]);
    setClients(res2.data.clients);
    setLocalities(res3.data.localities);
    setLoading(false);
  };

  const fetchProjects = async () => {
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

  const handleCreate = () => {
    setShowModal(true);
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
      name: "ESTADO",
      selector: (row: DataRow) => row.status,
      cell: (row: DataRow) => (
        <span
          className="badge rounded-pill"
          style={{
            fontSize: ".9em",
            color: "black",
            backgroundColor: Statuses[row.status] || "gray",
          }}
        >
          {row.status}
        </span>
      ),
      center: true,
      maxWidth: "160px",
    },
    {
      name: "CLIENTE",
      selector: (row: DataRow) => row.client,
      maxWidth: "250px",
    },
    {
      name: "DESCRIPCIÓN",
      selector: (row: DataRow) => row.title || "",
    },
    {
      name: "LOCALIDAD",
      selector: (row: DataRow) => row.locality,
      maxWidth: "250px",
    },
    {
      name: "PRIORIDAD",
      selector: (row: DataRow) => row.priority,
      cell: (row: DataRow) => (
        <span
          className="badge rounded-pill"
          style={{
            fontSize: ".9em",
            color: "black",
            backgroundColor: Priorities[row.priority] || "gray",
          }}
        >
          {row.priority}
        </span>
      ),
      center: true,
      maxWidth: "160px",
    },
  ];

  const handleClick = (row: DataRow) => {
    navigate(`/proyectos/${row.id}`);
  };

  const handleHide = () => {
    setShowModal(false);
  };

  const handleSumit = async (formData: ProjectFormInterface) => {
    const confirmation = await SweetAlert2.confirm("¿Desea crear el proyecto?");
    if (confirmation.isConfirmed) {
      try {
        const { data } = await apiSJM.post(endpoint, formData);
        SweetAlert2.successToast(data.message);
        handleHide();
        fetchProjects();
      } catch (error: any) {
        SweetAlert2.errorAlert(error.response.data.message);
      }
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Filters
            state={state}
            dispatch={dispatch}
            handleFiltersChange={handleFiltersChange}
            handleResetFilters={handleResetFilters}
            handleCreate={handleCreate}
            clients={clients}
            localities={localities}
          />

          <CreateProjectModal
            show={showModal}
            onHide={handleHide}
            onSubmit={handleSumit}
            clients={clients}
            localities={localities}
          />
        </>
      )}

      <Datatable
        title="Listado de proyectos"
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
