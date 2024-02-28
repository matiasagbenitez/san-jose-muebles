import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import { DatatableParams, initialState, paramsReducer, fetchData } from "../shared";
import { CountriesFilters } from ".";
import { SweetAlert2 } from "../../../utils";

interface DataRow {
  id: number;
  name: string;
}

export const Countries = () => {
  const navigate = useNavigate();
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
    SweetAlert2.confirmationDialog("¿Desea crear un nuevo país?");
  };
  
  const handleEdit = (id: number) => {
    SweetAlert2.successToast("Editado");
  };

  const handleSave = (data: DataRow) => {
  }
  
  const handleDelete = (id: number) => {
    SweetAlert2.errorToast("Eliminado");
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
      width: "200px",
      cell: (row: any) => (
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary p-0" onClick={() => handleEdit(row.id)}>
            Editar
          </button>
          <button onClick={() => handleDelete(row.id)}>
            Eliminar
          </button>
        </div>
      ),
    },
  ];

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
    </div>
  );
};
