import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import apiSJM from "../../../api/apiSJM";
import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
  ActionButtons,
  FilterByName,
  FormName,
} from "../../shared";

import { SweetAlert2 } from "../../utils";

interface DataRow {
  id: number;
  name: string;
}

const initialForm = {
  name: "",
};

export const Members = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(initialForm);
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const endpoint = "/members";

  // DATOS Y PAGINACIÓN
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

  // CREAR, EDITAR Y ELIMINAR
  const handleCreate = () => {
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleEdit = (row: DataRow) => {
    setEditingId(row.id);
    setForm(row);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: any) => {
    try {
      setIsFormSubmitting(true);
      if (editingId) {
        const { data } = await apiSJM.put(`${endpoint}/${editingId}`, formData);
        SweetAlert2.successToast(data.message);
      } else {
        const { data } = await apiSJM.post(endpoint, formData);
        SweetAlert2.successToast(data.message);
      }
      handleHide();
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDelete = async (row: DataRow) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Eliminar el miembro " + row.name + "?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      const { data } = await apiSJM.delete(`${endpoint}/${row.id}`);
      SweetAlert2.successToast(data.message);
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
      name: "NOMBRE DEL MIEMBRO",
      selector: (row: DataRow) => row.name,
    },
    {
      name: "ACCIONES",
      button: true,
      cell: (row: any) => (
        <ActionButtons
          row={row}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ),
    },
  ];

  // MODAL
  const handleHide = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <div>
      <FilterByName
        state={state}
        dispatch={dispatch}
        placeholder="Buscar por nombre de miembro"
        handleFiltersChange={handleFiltersChange}
        handleResetFilters={handleResetFilters}
        handleCreate={handleCreate}
      />

      <Datatable
        title="Listado de miembros"
        columns={columns as TableColumn<DataRow>[]}
        data={state.data}
        loading={state.loading}
        totalRows={state.totalRows}
        handleRowsPerPageChange={handleRowsPerPageChange}
        handlePageChange={handlePageChange}
      />

      <FormName
        show={isModalOpen}
        onHide={handleHide}
        form={form}
        editingId={editingId}
        onSubmit={handleSubmit}
        prefix="del"
        title="miembro"
        isFormSubmitting={isFormSubmitting}
      />
    </div>
  );
};
