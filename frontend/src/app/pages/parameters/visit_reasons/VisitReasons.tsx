import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import apiSJM from "../../../../api/apiSJM";
import {
  DatatableParams,
  initialState,
  paramsReducer,
  fetchData,
  ActionButtons,
  FilterByName,
} from "../shared";
import { SweetAlert2 } from "../../../utils";
import { VisitReasonForm } from ".";

interface DataRow {
  id: number;
  name: string;
  color: string;
}

export interface PriorityFormInterface {
  name: string;
  color: string;
}

const initialForm: PriorityFormInterface = {
  name: "",
  color: "#000000",
};

export const VisitReasons = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(initialForm);
  const [state, dispatch] = useReducer(paramsReducer, initialState);
  const endpoint = "/visit_reasons";

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
    const confirmation = await SweetAlert2.confirm(
      "¿Eliminar el motivo de visita " + row.name + "?"
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

  // COLUMNAS Y RENDERIZADO
  const columns: TableColumn<DataRow>[] = [
    {
      name: "ID",
      selector: (row: DataRow) => row.id,
      width: "80px",
      center: true,
    },
    {
      name: "PRIORIDAD",
      selector: (row: DataRow) => row.name,
    },
    {
      name: "COLOR",
      cell: (row: DataRow) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              backgroundColor: row.color,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
            }}
          ></div>
          <span style={{ marginLeft: "10px" }}>{row.color}</span>
        </div>
      ),
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
        placeholder="Buscar por nombre de motivo de visita"
        handleFiltersChange={handleFiltersChange}
        handleResetFilters={handleResetFilters}
        handleCreate={handleCreate}
      />

      <DatatableParams
        title="Motivos de visita"
        columns={columns as TableColumn<DataRow>[]}
        data={state.data}
        loading={state.loading}
        totalRows={state.totalRows}
        handleRowsPerPageChange={handleRowsPerPageChange}
        handlePageChange={handlePageChange}
      />

      <VisitReasonForm
        show={isModalOpen}
        onHide={handleHide}
        form={form}
        editingId={editingId}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
