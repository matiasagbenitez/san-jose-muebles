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
} from "../shared";
import { LocalitiesFilters, LocalitiesForm } from ".";
import { SweetAlert2 } from "../../../utils";

interface DataRow {
  id: number;
  name: string;
  id_province: string | number;
  province: string;
  id_country: string | number;
  country: string;
}

export interface LocalityFormInterface {
  name: string;
  id_province: string | number;
}

const initialForm: LocalityFormInterface = {
  name: "",
  id_province: "",
};

export const Localities = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(initialForm);
  const [state, dispatch] = useReducer(paramsReducer, initialState);
  const [provinces, setProvinces] = useState([]);
  const endpoint = "/localities";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      const [_, response] = await Promise.all([
        fetchData(endpoint, 1, state, dispatch),
        apiSJM.get("/provinces"),
      ]);
      setProvinces(response.data.items);
    } catch (error) {
      dispatch({ type: "FETCH_FAILURE" });
    }
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

  const handleSubmit = async (formData: LocalityFormInterface) => {
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
      "¿Eliminar la localidad " + row.name + "?"
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
      name: "LOCALIDAD",
      selector: (row: DataRow) => row.name,
    },
    {
      name: "PROVINCIA",
      selector: (row: DataRow) => row.province,
    },
    {
      name: "PAÍS",
      selector: (row: DataRow) => row.country,
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
      <LocalitiesFilters
        state={state}
        dispatch={dispatch}
        handleFiltersChange={handleFiltersChange}
        handleResetFilters={handleResetFilters}
        handleCreate={handleCreate}
      />

      <DatatableParams
        title="Localidades"
        columns={columns as TableColumn<DataRow>[]}
        data={state.data}
        loading={state.loading}
        totalRows={state.totalRows}
        handleRowsPerPageChange={handleRowsPerPageChange}
        handlePageChange={handlePageChange}
      />

      <LocalitiesForm
        show={isModalOpen}
        onHide={handleHide}
        form={form}
        editingId={editingId}
        onSubmit={handleSubmit}
        provinces={provinces}
      />
    </div>
  );
};
