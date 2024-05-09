import React, { useState, useEffect, useReducer } from "react";
import { Button, Modal, Form, InputGroup, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { DayJsAdapter, toMoney } from "../../../helpers";

import { NumericFormat } from "react-number-format";
import { SweetAlert2 } from "../../utils";

import { TableColumn } from "react-data-table-component";
import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";
import {
  Statuses,
  AccountInterface,
  TransactionDataRow as DataRow,
  MovementType,
  types,
} from "./interfaces";
import { NumberFormatter } from "../../helpers";

const initialForm = {
  type: "",
  description: "",
  amount: 0,
  id_currency: "",
  equivalent_amount: 0,
};

export const ProjectAccountTransactions = () => {
  const { id, id_project_account } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = `/project_account_transactions/${id_project_account}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<AccountInterface>();
  const [accountCurrency, setAccountCurrency] = useState<string>("");

  const [currencies, setCurrencies] = useState<any>([]);
  const [formData, setFormData] = useState(initialForm);

  const fetch = async () => {
    const [res1, res2, _] = await Promise.all([
      apiSJM.get(`/project_accounts/${id_project_account}`),
      apiSJM.get("/currencies"),
      fetchData(endpoint, 1, state, dispatch),
    ]);
    setAccount(res1.data.account);
    setCurrencies(res2.data.items);
    setAccountCurrency(res1.data.account.currency.name);
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

  const columns: TableColumn<DataRow>[] = [
    {
      name: "ID",
      selector: (row: DataRow) => row.id,
      width: "80px",
      center: true,
    },
    {
      name: "FECHA REGISTRO",
      selector: (row: DataRow) =>
        DayJsAdapter.toDayMonthYearHour(row.createdAt),
      maxWidth: "140px",
      center: true,
    },
    {
      name: "RESPONSABLE",
      selector: (row: DataRow) => row.user,
      maxWidth: "140px",
      center: true,
    },
    {
      name: "DESCRIPCIÓN",
      selector: (row: DataRow) => row.description,
    },
    {
      name: "TIPO MOVIMIENTO",
      selector: (row: DataRow) => row.type,
      cell: (row: DataRow) => {
        if (!(row.type in MovementType)) {
          throw new Error(`Invalid type: ${row.type}`);
        }

        return (
          <div className="d-flex align-items-center">
            <i
              className={types[row.type as MovementType].icon}
              title={types[row.type as MovementType].title}
            ></i>
            <span className="ms-2">
              {types[row.type as MovementType].label}
            </span>
          </div>
        );
      },
      maxWidth: "300px",
    },
    {
      name: "MONTO MOVIMIENTO",
      selector: (row: DataRow) => row.received_amount,
      format: (row: any) => (
        <>
          <small className="text-muted">{row.currency}</small>
          {row.is_monetary ? " $" : " "}
          {toMoney(row.received_amount)}
        </>
      ),
      maxWidth: "170px",
      right: true,
    },
    {
      name: "MONEDA",
      selector: (row: DataRow) => row.currency,
      maxWidth: "50px",
      omit: true,
    },
    {
      name: "SALDO ANTERIOR",
      selector: (row: DataRow) => toMoney(row.prev_balance),
      maxWidth: "170px",
      right: true,
    },
    {
      name: "MONTO EQUIVALENTE",
      maxWidth: "170px",
      // selector: (row: DataRow) => toMoney(row.equivalent_amount),
      selector: (row: DataRow) => toMoney(row.equivalent_amount),
      right: true,
      style: { fontWeight: "bold", background: "#f0f0f0", fontSize: "1.1em" },
    },
    {
      name: "SALDO POSTERIOR",
      maxWidth: "170px",
      selector: (row: DataRow) => toMoney(row.post_balance),
      right: true,
    },
  ];

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setFormData(initialForm);
  };

  // const handleRedirectPurchase = (id_purchase: number) => {
  //   navigate(`/compras/${id_purchase}`);
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const confirmation = await SweetAlert2.confirm(
        "¿Está seguro de registrar el movimiento?"
      );
      if (!confirmation.isConfirmed) return;
      setLoading(true);
      await apiSJM.post("/project_account_transactions/new-movement", {
        ...formData,
        id_supplier_account: id_project_account,
      });
      fetch();
      handleClose();
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && account && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-3 align-items-center">
              <Button
                variant="light border text-muted"
                size="sm"
                onClick={() => navigate(`/proyectos/${id}/cuentas`)}
                title="Volver al detalle de cuentas"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Atrás
              </Button>
              <h1 className="fs-5 my-0">
                Detalle de cuenta corriente proyecto
              </h1>
            </div>
            <Button size="sm" variant="success" onClick={handleCreate}>
              Nuevo movimiento
            </Button>
          </div>

          <hr />

          <Row>
            <Col xs={12} md={6} xl={4}>
              <p className="text-muted">
                Cliente: <span className="fw-bold">{account.client}</span>
              </p>
            </Col>
            <Col xs={12} md={5}>
              <p className="text-muted">
                Proyecto:{" "}
                <span className="fw-bold">
                  {account.title || "Sin título especificado"} (
                  {account.locality})
                </span>
              </p>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <p className="text-muted">
                Estado proyecto:{" "}
                <span
                  className="badge rounded-pill ms-1"
                  style={{
                    fontSize: ".9em",
                    color: "black",
                    backgroundColor: Statuses[account.status],
                  }}
                >
                  {account.status}
                </span>
              </p>
            </Col>
            <Col xs={12} md={6} xl={4}>
              <p className="text-muted">
                Moneda:{" "}
                <span className="fw-bold">{account.currency.name}</span>
              </p>
            </Col>
            <Col xs={12} md={6} xl={5}>
              <span className="text-muted">Saldo cuenta: </span>
              <span
                className={`my-0 text-center bg-${
                  account.balance < 0
                    ? "danger"
                    : account.balance == 0
                    ? "secondary"
                    : "success"
                } badge rounded-pill fs-6`}
              >
                {account.currency.symbol}{" "}
                {NumberFormatter.formatSignedCurrency(
                  account.currency.is_monetary,
                  account.balance
                )}
              </span>
            </Col>
          </Row>

          <Datatable
            title="Listado de últimos movimientos"
            columns={columns as TableColumn<DataRow>[]}
            data={state.data}
            loading={state.loading}
            totalRows={state.totalRows}
            handleRowsPerPageChange={handleRowsPerPageChange}
            handlePageChange={handlePageChange}
          />

          <Modal show={isModalOpen} onHide={() => handleClose()}>
            <div className="p-3">
              <h5>Nuevo movimiento</h5>
              <hr />

              <Form onSubmit={handleSubmit}>
                {/* TIPO DE MOVIMIENTO */}
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>Tipo de movimiento</InputGroup.Text>
                  <Form.Select
                    required
                    name="type"
                    onChange={(e: any) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="NEW_PAYMENT">
                      Pago del cliente a la empresa
                    </option>
                    <option value="POS_ADJ">
                      Ajuste a favor (disminuye deuda del cliente)
                    </option>
                    <option value="NEG_ADJ">
                      Ajuste en contra (aumenta deuda del cliente)
                    </option>
                  </Form.Select>
                </InputGroup>

                {/* DESCRIPCIÓN */}
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>Descripción</InputGroup.Text>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    required
                    onChange={(e: any) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </InputGroup>

                {/* MONTO */}
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>Recibí</InputGroup.Text>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    className="text-end form-control"
                    required
                    onChange={(e: any) =>
                      setFormData({
                        ...formData,
                        amount: e.target.value,
                      })
                    }
                  />
                  <Form.Select
                    required
                    name="id_currency"
                    onChange={(e: any) =>
                      setFormData({
                        ...formData,
                        id_currency: e.target.value,
                      })
                    }
                  >
                    {/* <option value="">Seleccione una moneda</option> */}
                    {currencies.map((currency: any) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.name}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>

                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>Equivalentes a</InputGroup.Text>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    className="text-end form-control"
                    value={formData.amount}
                    required
                  />
                  <InputGroup.Text>{accountCurrency}</InputGroup.Text>
                </InputGroup>

                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cerrar
                  </Button>
                  <Button size="sm" variant="primary" type="submit">
                    <i className="bi bi-floppy me-2"></i>
                    Registrar movimiento
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};
