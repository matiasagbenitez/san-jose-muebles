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
import { SuppliersForm } from ".";

interface DataRow {
  id: number;
  name: string;
  dni_cuit: string;
  phone: string;
  locality: string;
}

export const Suppliers = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = "/suppliers";

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

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: any) => {
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
      name: "PROVEEDOR",
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
  ];

  // MODAL
  const handleHide = () => {
    setIsModalOpen(false);
  };

  const handleClick = (row: DataRow) => {
    navigate(`/proveedores/${row.id}`);
  };

  return (
    <div>
      <FilterByName
        state={state}
        dispatch={dispatch}
        placeholder="Buscar por nombre de proveedor"
        handleFiltersChange={handleFiltersChange}
        handleResetFilters={handleResetFilters}
        handleCreate={handleCreate}
      />

      <Datatable
        title="Listado de proveedores"
        columns={columns as TableColumn<DataRow>[]}
        data={state.data}
        loading={state.loading}
        totalRows={state.totalRows}
        handleRowsPerPageChange={handleRowsPerPageChange}
        handlePageChange={handlePageChange}
        clickableRows
        onRowClicked={handleClick}
      />

      <SuppliersForm
        show={isModalOpen}
        onHide={handleHide}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
