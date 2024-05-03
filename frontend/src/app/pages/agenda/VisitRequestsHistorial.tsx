import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";
import { DayJsAdapter } from "../../../helpers";
import { LoadingSpinner } from "../../components";

interface DataRow {
  id: number;
  action: "CREATE" | "UPDATE" | "DELETE";
  before: { [key: string]: any };
  after: { [key: string]: any };
  user: string;
  date: Date;
}

export const VisitRequestsHistorial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = `/visit_requests/${id}/historial`;

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    setLoading(true);
    await fetchData(endpoint, 1, state, dispatch);
    setLoading(false);
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

  useEffect(() => {
    if (state.error) {
      navigate("/");
    }
  }, [state.error]);

  const handleClick = (row: DataRow) => {
    console.log(row);
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
      name: "TIPO DE ACCIÓN",
      selector: (row: DataRow) => row.action,
      cell: (row: DataRow) => (
        <span
          style={{
            fontSize: ".9em",
            backgroundColor:
              row.action === "CREATE"
                ? "green"
                : row.action === "UPDATE"
                ? "yellow"
                : "red",
            color: "black",
          }}
          className="badge rounded-pill"
        >
          {row.action}
        </span>
      ),
    },
    {
      name: "REALIZADO POR",
      selector: (row: DataRow) => row.user,
    },
  ];

  return (
    <div>
      {loading && <LoadingSpinner />}

      <Datatable
        title="Historial de modificaciones"
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
