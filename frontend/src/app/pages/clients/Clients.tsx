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
import { SweetAlert2 } from "../../utils";
import { ClientsForm, Filters } from "./components";
import { LoadingSpinner } from "../../components";

interface DataRow {
  id: number;
  name: string;
  dni_cuit: string;
  phone: string;
  locality: string;
  province: string;
}

export const Clients = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [localities, setLocalities] = useState([]);
  const endpoint = "/clients";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    setLoading(true);
    try {
      const [res, _] = await Promise.all([
        apiSJM.get("/localities"),
        fetchData(endpoint, 1, state, dispatch),
      ]);
      setLocalities(res.data.localities);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };

  const fetchClients = async () => {
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
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: any) => {
    try {
      setIsFormSubmitting(true);
      const confirmation = await SweetAlert2.confirm("¿Desea crear el cliente?");
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post(endpoint, formData);
      SweetAlert2.successToast(data.message);
      handleHide();
      fetchClients();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitting(false);
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
      name: "CLIENTE",
      selector: (row: DataRow) => row.name,
    },
    {
      name: "DNI/CUIT",
      selector: (row: DataRow) => row.dni_cuit,
      center: true,
    },
    {
      name: "TELÉFONO",
      selector: (row: DataRow) => row.phone,
      center: true,
    },
    {
      name: "LOCALIDAD",
      selector: (row: DataRow) => row.locality,
    },
    {
      name: "PROVINCIA",
      selector: (row: DataRow) => row.province,
    },
  ];

  // MODAL
  const handleHide = () => {
    setIsModalOpen(false);
  };

  const handleClick = (row: DataRow) => {
    navigate(`/clientes/${row.id}`);
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <Filters
            state={state}
            dispatch={dispatch}
            handleFiltersChange={handleFiltersChange}
            handleResetFilters={handleResetFilters}
            handleCreate={handleCreate}
            localities={localities}
          />

          <Datatable
            title="Listado de clientes"
            columns={columns as TableColumn<DataRow>[]}
            data={state.data}
            loading={state.loading}
            totalRows={state.totalRows}
            handleRowsPerPageChange={handleRowsPerPageChange}
            handlePageChange={handlePageChange}
            clickableRows
            onRowClicked={handleClick}
          />

          <ClientsForm
            show={isModalOpen}
            onHide={handleHide}
            onSubmit={handleSubmit}
            localities={localities}
            isFormSubmitting={isFormSubmitting}
          />
        </>
      )}
    </div>
  );
};
