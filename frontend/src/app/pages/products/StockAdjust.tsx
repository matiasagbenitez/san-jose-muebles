import React, { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";

// import { ProductsFilter } from "./components";
import apiSJM from "../../../api/apiSJM";
import { DayJsAdapter } from "../../../helpers";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { SweetAlert2 } from "../../utils";

interface DataRow {
  id: number;
  updated_at: Date;
  user: string;
  comment: string;
  prev_stock: number;
  quantity: number;
  post_stock: number;
}

const initialForm = {
  op: "sub",
  quantity: 1,
  comment: "",
};

export const StockAdjust = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(paginationReducer, initialState);

  const [product, setProduct] = useState({} as any);
  const [actualStock, setActualStock] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const endpoint = `/stock_adjusts/by-product/${id}`;

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    setLoading(true);
    const [_, res2] = await Promise.all([
      fetchData(endpoint, 1, state, dispatch),
      apiSJM.get(`/products/${id}`),
    ]);
    setProduct(res2.data.product);
    setActualStock(res2.data.product.actual_stock);
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
      name: "FECHA",
      selector: (row: DataRow) =>
        DayJsAdapter.toDayMonthYearHour(row.updated_at),
      width: "150px",
      center: true,
    },
    {
      name: "RESPONSABLE",
      selector: (row: DataRow) => row.user,
      width: "200px",
      center: true,
    },
    {
      name: "COMENTARIO",
      selector: (row: DataRow) => row.comment,
    },
    {
      name: "STOCK ANTERIOR",
      selector: (row: DataRow) => row.prev_stock + ` ${product.unit_symbol}`,
      width: "150px",
      center: true,
    },
    {
      name: "AJUSTE",
      selector: (row: DataRow) => row.quantity + ` ${product.unit_symbol}`,
      width: "150px",
      style: { fontWeight: "bold" },
      center: true,
    },
    {
      name: "STOCK POSTERIOR",
      selector: (row: DataRow) => row.post_stock + ` ${product.unit_symbol}`,
      width: "150px",
      center: true,
    },
  ];

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setForm(initialForm);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const confirmation = await SweetAlert2.confirm(
        "¿Estás seguro de realizar esta operación?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.put(`/products/${id}/adjust-stock`, form);
      setActualStock(data.new_stock);
      SweetAlert2.successToast(data.message);
      handleClose();
      fetchData(endpoint, 1, state, dispatch);
    } catch (error: any) {
      console.log(error);
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      {!loading && product && (
        <>
          <div className="d-flex gap-3 align-items-center mb-3">
            <Button
              variant="light border text-muted"
              size="sm"
              onClick={() => navigate(`/productos/${id}`)}
              title="Volver al detalle del producto"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Atrás
            </Button>
            <h1 className="fs-5 my-0">Ajustar stock de un producto</h1>
          </div>

          <hr className="my-3" />

          <Row>
            <Col lg={5}>
              <div className="mb-3">
                <h2 className="fs-6 my-0">Producto</h2>
                <p className="mb-0">{product.name}</p>
              </div>
            </Col>
            <Col lg={2}>
              <div className="mb-3">
                <h2 className="fs-6 my-0">Marca</h2>
                <p className="mb-0">{product.brand}</p>
              </div>
            </Col>
            <Col lg={2}>
              <div className="mb-3">
                <h2 className="fs-6 my-0">Unidad</h2>
                <p className="mb-0">
                  {product.unit} ({product.unit_symbol})
                </p>
              </div>
            </Col>
            <Col lg={1}>
              <div className="mb-3">
                <h2 className="fs-6 my-0">Stock actual</h2>
                <p className="mb-0">
                  {actualStock} {product.unit_symbol}
                </p>
              </div>
            </Col>
            <Col
              lg={2}
              className="d-flex justify-content-end align-items-center"
            >
              <Button size="sm" variant="success" onClick={() => handleOpen()}>
                Nuevo ajuste de stock
              </Button>
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

          <Modal show={isModalOpen} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Nuevo ajuste de stock</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form className="mb-3" onSubmit={handleSubmit}>
                <Row>
                  <Col lg={7}>
                    <InputGroup className="mb-3" size="sm">
                      <InputGroup.Text>Operación</InputGroup.Text>
                      <Form.Select
                        required
                        value={form.op}
                        onChange={(e) =>
                          setForm({ ...form, op: e.target.value })
                        }
                      >
                        <option value="sub">Decrementar stock</option>
                        <option value="add">Incrementar stock</option>
                      </Form.Select>
                    </InputGroup>
                  </Col>
                  <Col lg={5}>
                    <InputGroup className="mb-3" size="sm">
                      <InputGroup.Text>Cantidad</InputGroup.Text>
                      <Form.Control
                        className="text-end"
                        type="number"
                        value={form.quantity}
                        onChange={(e) =>
                          setForm({ ...form, quantity: Number(e.target.value) })
                        }
                        required
                        step={0.1}
                        min={0.1}
                      />
                    </InputGroup>
                  </Col>
                  <Col lg={12}>
                    <InputGroup className="mb-3" size="sm">
                      <InputGroup.Text>Comentario</InputGroup.Text>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={form.comment}
                        onChange={(e) =>
                          setForm({ ...form, comment: e.target.value })
                        }
                      />
                    </InputGroup>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end gap-2">
                  <Button size="sm" variant="secondary" onClick={handleClose}>
                    Cerrar
                  </Button>
                  <Button size="sm" variant="primary" type="submit">
                    Guardar
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};
