import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";

import apiSJM from "../../../api/apiSJM";
import { SweetAlert2 } from "../../utils";
import { Filters, InventoryItemsForm } from "./components";

import { InventoryDataRow as DataRow, InventoryStatus } from "./interfaces";
import { LoadingSpinner } from "../../components";

interface ParamsInterface {
  id: string;
  name: string;
}

export const InventoryItems = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const [brands, setBrands] = useState<ParamsInterface[]>([]);
  const [categories, setCategories] = useState<ParamsInterface[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const endpoint = "/inventory_items";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      setLoading(true);
      const [_, res2, res3] = await Promise.all([
        fetchData(endpoint, 1, state, dispatch),
        apiSJM.get("/inventory_brands"),
        apiSJM.get("/inventory_categories"),
      ]);
      setBrands(res2.data.items);
      setCategories(res3.data.items);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };

  const fetchInventoryItems = async () => {
    fetchData(endpoint, 1, state, dispatch);
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
      console.log(state.error);
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
      name: "CATEGORÍA",
      selector: (row: DataRow) => row.category,
      maxWidth: "180px",
      wrap: true,
    },
    {
      name: "MARCA",
      selector: (row: DataRow) => row.brand,
      maxWidth: "180px",
      wrap: true,
    },
    {
      name: "ARTÍCULO",
      selector: (row: DataRow) => row.name,
      wrap: true,
    },
    {
      name: "CÓDIGO INTERNO",
      maxWidth: "180px",
      selector: (row: DataRow) => row.code,
      center: true,
    },
    {
      name: "ESTADO",
      selector: (row: DataRow) => row.status,
      cell: (row: DataRow) => (
        <span
          style={{
            fontSize: ".9em",
            backgroundColor: InventoryStatus[row.status] || "gray",
            color: "black",
          }}
          className="badge rounded-pill"
        >
          {row.status}
        </span>
      ),
      maxWidth: "180px",
      center: true,
    },
  ];

  const handleClick = (row: DataRow) => {
    navigate(`/inventario/${row.id}`);
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleHide = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData: any) => {
    const name = (formData.name as string).toUpperCase();
    const confirm = await SweetAlert2.confirm("¿Desea crear el artículo " + name + "?");
    if (!confirm.isConfirmed) return;
    try {
      setIsFormSubmitting(true);
      const { data } = await apiSJM.post(endpoint, formData);
      SweetAlert2.successToast(data.message);
      handleHide();
      fetchInventoryItems();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitting(false);
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
            brands={brands}
            categories={categories}
          />

          <Datatable
            title="Inventario de artículos"
            columns={columns as TableColumn<DataRow>[]}
            data={state.data}
            loading={state.loading}
            totalRows={state.totalRows}
            handleRowsPerPageChange={handleRowsPerPageChange}
            handlePageChange={handlePageChange}
            clickableRows
            onRowClicked={handleClick}
          />

          <InventoryItemsForm
            show={isModalOpen}
            onHide={handleHide}
            onSubmit={handleSubmit}
            brands={brands}
            categories={categories}
            isFormSubmitting={isFormSubmitting}
          />
        </>
      )}
    </div>
  );
};
