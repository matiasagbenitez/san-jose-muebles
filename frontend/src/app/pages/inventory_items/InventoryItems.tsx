import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";

import { Filters, InventoryItemsForm } from "./components";
import apiSJM from "../../../api/apiSJM";
import { DayJsAdapter } from "../../../helpers";
import { Badge } from "react-bootstrap";
import { SweetAlert2 } from "../../utils";

interface ParamsInterface {
  id: string;
  name: string;
}
interface DataRow {
  id: number;
  category: string;
  brand: string;
  quantity: number;
  code: string;
  name: string;
  last_check_at: Date;
  last_check_by: string;
  is_retired: boolean;
}

export const InventoryItems = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const [brands, setBrands] = useState<ParamsInterface[]>([]);
  const [categories, setCategories] = useState<ParamsInterface[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const endpoint = "/inventory_items";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    const [_, res2, res3] = await Promise.all([
      fetchData(endpoint, 1, state, dispatch),
      apiSJM.get("/inventory_brands"),
      apiSJM.get("/inventory_categories"),
    ]);
    setBrands(res2.data.items);
    setCategories(res3.data.items);
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
      name: "MARCA",
      selector: (row: DataRow) => row.brand,
      maxWidth: "150px",
      wrap: true,
    },
    {
      name: "CATEGORÍA",
      selector: (row: DataRow) => row.category,
      maxWidth: "250px",
      wrap: true,
    },
    {
      name: "CÓDIGO INTERNO",
      maxWidth: "150px",
      selector: (row: DataRow) => row.code,
      center: true,
    },
    {
      name: "ARTÍCULO",
      selector: (row: DataRow) => row.name,
      wrap: true,
    },
    {
      name: "CANTIDAD",
      selector: (row: DataRow) => row.quantity,
      maxWidth: "100px",
      center: true,
      style: {
        fontWeight: "bold",
        backgroundColor: "#f0f0f0",
        fontSize: "1.1em",
      },
    },
    {
      name: "ÚLTIMA ACTUALIZACIÓN",
      selector: (row: DataRow) =>
        DayJsAdapter.toDayMonthYearHour(row.last_check_at),
      maxWidth: "175px",
      center: true,
    },
    {
      name: "RESPONSABLE",
      selector: (row: DataRow) => row.last_check_by,
      maxWidth: "150px",
      center: true,
      wrap: true,
    },
    {
      name: "ESTADO",
      selector: (row: DataRow) => row.is_retired,
      cell: (row: DataRow) => (
        <Badge bg={row.is_retired ? "danger" : "success"}>
          {row.is_retired ? "BAJA" : "VIGENTE"}
        </Badge>
      ),
      maxWidth: "100px",
      center: true,
    },
  ];

  const handleClick = (row: DataRow) => {
    navigate(`/productos/${row.id}`);
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleHide = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData: any) => {
    try {
      const quantity = formData.quantity as number;
      const name = (formData.name as string).toUpperCase();
      const confirm = await SweetAlert2.confirm(
        "¿Desea crear " + quantity + " artículo/s " + name + "?"
      );
      if (!confirm.isConfirmed) return;
      const { data } = await apiSJM.post(endpoint, formData);
      SweetAlert2.successToast(data.message);
      handleHide();
      fetchInventoryItems();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <div>
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
      />
    </div>
  );
};
