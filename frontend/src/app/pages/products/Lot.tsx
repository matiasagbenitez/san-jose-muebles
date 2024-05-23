import { useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";

import { DateFormatter } from "../../helpers";
import { SimplePageHeader } from "../../components";
import apiSJM from "../../../api/apiSJM";
import { Col, Row } from "react-bootstrap";

interface DataRow {
  id: number;
  product: string;
  prev_stock: number;
  quantity: number;
  post_stock: number;
}

interface StockLot {
  id: number;
  type: "INCREMENT" | "DECREMENT";
  description: string;
  total_items: number;
  username: string;
  created_at: Date;
}

export const Lot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(paginationReducer, initialState);

  const [loading, setLoading] = useState(true);
  const [lot, setLot] = useState<StockLot | null>(null);

  const endpoint = `/stock_lots/${id}`;

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      setLoading(true);
      const [res, _] = await Promise.all([
        apiSJM.get(`/stock_lots/${id}/basic`),
        fetchData(endpoint, 1, state, dispatch),
      ]);
      setLot(res.data.item);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/productos/ajustes");
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

  useEffect(() => {
    if (state.error) {
      navigate("/");
    }
  }, [state.error]);

  // COLUMNAS Y RENDERIZADO
  const columns: TableColumn<DataRow>[] = useMemo(
    () => [
      {
        name: "ID",
        selector: (row: DataRow) => row.id,
        width: "80px",
        center: true,
      },
      {
        name: "PRODUCTO",
        selector: (row: DataRow) => row.product,
        wrap: true,
      },
      {
        name: "STOCK ANTERIOR",
        selector: (row: DataRow) => row.prev_stock,
        maxWidth: "150px",
        center: true,
      },
      {
        // name: "CANTIDAD",
        name: `${lot?.type === "INCREMENT" ? "INCREMENTO" : "DECREMENTO"}`,
        selector: (row: DataRow) => row.quantity,
        style: { fontWeight: "bold" },
        maxWidth: "140px",
        center: true,
      },
      {
        name: "STOCK POSTERIOR",
        selector: (row: DataRow) => row.post_stock,
        maxWidth: "150px",
        center: true,
      },
    ],
    []
  );

  return (
    <>
      {!loading && lot && (
        <>
          <SimplePageHeader
            goBackTo={`/productos/ajustes`}
            goBackTitle="Volver al listado de ajustes"
            title="Detalle del ajuste de stock"
            hr
          />

          <Row>
            <Col xs={12} xl={6}>
              <p>Descripción: {lot.description}</p>
            </Col>
            <Col xs={12} xl={3}>
              <p className="small fst-italic">
                {DateFormatter.toDMYH(lot.created_at)} ({lot.username})
              </p>
            </Col>
            <Col xs={12} xl={3}>
              <p className="text-center text-lg-end">
                <span
                  className={`badge rounded-pill ${
                    lot.type === "INCREMENT" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {lot.type === "INCREMENT" ? "INCREMENTO" : "DECREMENTO"}
                  {` EN ${lot.total_items} PRODUCTOS`}
                </span>
              </p>
            </Col>
          </Row>

          <Datatable
            title="Listado de ajustes de stock del lote seleccionado"
            columns={columns as TableColumn<DataRow>[]}
            data={state.data}
            loading={state.loading}
            totalRows={state.totalRows}
            handleRowsPerPageChange={handleRowsPerPageChange}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
};
