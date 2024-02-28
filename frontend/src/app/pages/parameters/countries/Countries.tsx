import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import apiSJM from "../../../../api/apiSJM";
import {
  DatatableParams,
  initialState,
  paramsReducer,
  fetchData,
} from "../shared";
import { CountriesFilters, CountriesForm } from ".";
import { SweetAlert2 } from "../../../utils";

interface DataRow {
  id: number;
  name: string;
}

export interface CountryFormInterface {
  name: string;
}

const initialForm: CountryFormInterface = {
  name: "",
};

export const Countries = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(initialForm);
  const [state, dispatch] = useReducer(paramsReducer, initialState);
  const endpoint = "/countries";

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

  const handleCreate = () => {
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleEdit = (row: DataRow) => {
    setEditingId(row.id);
    setForm(row);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: CountryFormInterface) => {
    try {
      if (editingId) {
        const { data } = await apiSJM.put(`${endpoint}/${editingId}`, formData);
        SweetAlert2.successToast(data.message);
        handleHide();
      } else {
        const { data } = await apiSJM.post(endpoint, formData);
        SweetAlert2.successToast(data.message);
        handleHide();
      }
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  const handleDelete = async (row: DataRow) => {
    const confirmation = await SweetAlert2.confirmationDialog(
      "¿Eliminar el país " + row.name + "?"
    );
    try {
      if (confirmation.isConfirmed) {
        const { data } = await apiSJM.delete(`${endpoint}/${row.id}`);
        SweetAlert2.successToast(data.message);
        fetch();
      }
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  const columns: TableColumn<DataRow>[] = [
    {
      name: "ID",
      selector: (row: DataRow) => row.id,
      width: "80px",
      center: true,
    },
    {
      name: "Nombre del país",
      selector: (row: DataRow) => row.name,
    },
    {
      name: "Acciones",
      button: true,
      cell: (row: any) => (
        <div className="d-flex justify-content-center">
          <button
            title="Editar"
            className="btn btn-transparent py-0 px-1"
            onClick={() => handleEdit(row)}
          >
            <i className="bi bi-pencil-square text-secondary-emphasis"></i>
          </button>
          <button
            title="Eliminar"
            className="btn btn-transparent py-0 px-1"
            onClick={() => handleDelete(row)}
          >
            <i className="bi bi-trash2 text-danger"></i>
          </button>
        </div>
      ),
    },
  ];

  const handleHide = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <div>
      <CountriesFilters
        state={state}
        dispatch={dispatch}
        handleFiltersChange={handleFiltersChange}
        handleResetFilters={handleResetFilters}
        handleCreate={handleCreate}
      />

      <DatatableParams
        title="Países"
        columns={columns as TableColumn<DataRow>[]}
        data={state.data}
        loading={state.loading}
        totalRows={state.totalRows}
        handleRowsPerPageChange={handleRowsPerPageChange}
        handlePageChange={handlePageChange}
      />

      <CountriesForm
        show={isModalOpen}
        onHide={handleHide}
        form={form}
        editingId={editingId}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
