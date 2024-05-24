import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";

import apiSJM from "../../../api/apiSJM";
import { DateFormatter } from "../../helpers";
import { PageHeader } from "../../components";
import { Button, Col, Row } from "react-bootstrap";

interface DataRow {
  id: number;
  id_lot: number;
  prev_stock: number;
  quantity: number;
  post_stock: number;
  createdAt: Date;
}

export const ProductAdjusts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(paginationReducer, initialState);

  const [product, setProduct] = useState({} as any);
  const [loading, setLoading] = useState(true);

  const endpoint = `/stock_adjusts/by-product/${id}`;

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    setLoading(true);
    const [_, res2] = await Promise.all([
      fetchData(endpoint, 1, state, dispatch),
      apiSJM.get(`/products/${id}`),
    ]);
    setProduct(res2.data.product);
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

  // COLUMNAS Y RENDERIZADO
  const columns: TableColumn<DataRow>[] = [
    {
      name: "ID",
      selector: (row: DataRow) => row.id,
      width: "80px",
      center: true,
    },
    {
      name: "FECHA REGISTRO",
      selector: (row: DataRow) => DateFormatter.toDMYH(row.createdAt),
      maxWidth: "160px",
      center: true,
    },
    {
      name: "STOCK ANTERIOR",
      selector: (row: DataRow) => row.prev_stock + ` ${product.unit_symbol}`,
      center: true,
    },
    {
      name: "AJUSTE",
      selector: (row: DataRow) => row.quantity + ` ${product.unit_symbol}`,
      style: { fontWeight: "bold" },
      center: true,
      conditionalCellStyles: [
        {
          when: (row: DataRow) => row.quantity < 0,
          style: {
            color: "red",
          },
        },
        {
          when: (row: DataRow) => row.quantity > 0,
          style: {
            color: "green",
          },
        },
      ],
    },
    {
      name: "STOCK POSTERIOR",
      selector: (row: DataRow) => row.post_stock + ` ${product.unit_symbol}`,
      center: true,
    },
    {
      name: "VER LOTE",
      button: true,
      cell: (row: DataRow) => (
        <Button
          size="sm"
          variant="secondary"
          className="py-0"
          onClick={() => navigate(`/productos/ajustes/${row.id_lot}`)}
        >
          <small>Ver lote</small>
        </Button>
      ),
      center: true,
    },
  ];

  return (
    <>
      {!loading && product && (
        <>
          <PageHeader
            goBackTo={`/productos/${id}`}
            goBackTitle="Volver al detalle del producto"
            title="Listado de ajustes de stock de un producto"
          />

          <Row>
            <Col xs={12} lg={7}>
              <h6 className="text-muted">
                <strong>Producto:</strong> {product.name}
              </h6>
            </Col>
            <Col xs={12} lg={5}>
              <h6 className="text-muted">
                <strong>Marca:</strong> {product.brand}
              </h6>
            </Col>
          </Row>

          <Datatable
            title="Listado de ajustes de stock del producto seleccionado"
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
