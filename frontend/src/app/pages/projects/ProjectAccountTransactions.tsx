import React, { useState, useEffect, useReducer } from "react";
import {
  Button,
  Modal,
  Form,
  InputGroup,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { DayJsAdapter, convertToMoney, toMoney } from "../../../helpers";

import { NumericFormat } from "react-number-format";
import { SweetAlert2 } from "../../utils";

import { TableColumn } from "react-data-table-component";
import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";
import { MySelect } from "../../components/forms";

interface AccountInterface {
  id: number;
  supplier: string;
  currency: string;
  symbol: string;
  is_monetary: boolean;
  balance: number;
}

enum MovementType {
  NEW_PAYMENT = "NEW_PAYMENT",
  POS_ADJ = "POS_ADJ",
  NEG_ADJ = "NEG_ADJ",
}

const types: Record<
  MovementType,
  { label: string; icon: string; title: string }
> = {
  [MovementType.NEW_PAYMENT]: {
    label: "PAGO DEL CLIENTE",
    icon: "bi bi-arrow-up-circle-fill fs-6 text-success",
    title: "Disminuye la deuda del cliente",
  },
  [MovementType.POS_ADJ]: {
    label: "AJUSTE A FAVOR",
    icon: "bi bi-arrow-up-circle-fill fs-6 text-success",
    title: "Disminuye la deuda del cliente",
  },
  [MovementType.NEG_ADJ]: {
    label: "AJUSTE EN CONTRA",
    icon: "bi bi-arrow-down-circle-fill fs-6 text-danger",
    title: "Aumenta la deuda del cliente",
  },
};

const enum Flags {
  ARS = "🇦🇷",
  USD = "🇺🇸",
  BRL = "🇧🇷",
  EUR = "🇪🇺",
}

const flags: Record<string, string> = {
  ARS: Flags.ARS,
  USD: Flags.USD,
  BRL: Flags.BRL,
  EUR: Flags.EUR,
};

const initialForm = {
  type: "",
  description: "",
  amount: 0,
};

interface DataRow {
  id: number;
  createdAt: Date;
  user: string;
  type:
    | "NEW_PAYMENT"
    | "POS_ADJ"
    | "NEG_ADJ"
    | "NEW_SUPPLIER_PAYMENT"
    | "DEL_SUPPLIER_PAYMENT";
  description: string;
  received_amount: number;
  currency: string;
  prev_balance: number;
  equivalent_amount: number;
  post_balance: number;
}

export const ProjectAccountTransactions = () => {
  const { id, id_project_account } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = `/project_account_transactions/${id_project_account}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<any>(null);

  const [currencies, setCurrencies] = useState<any>([]);
  const [formData, setFormData] = useState(initialForm);

  const fetch = async () => {
    const [_, res2, res3] = await Promise.all([
      fetchData(endpoint, 1, state, dispatch),
      apiSJM.get("/currencies"),
      apiSJM.get(`/project_accounts/${id_project_account}`),
    ]);
    setCurrencies(res2.data.items);
    setAccount(res3.data.account);
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
              <h1 className="fs-5 my-0">Cuenta corriente {account.title}</h1>
            </div>
            <Button size="sm" variant="success" onClick={handleCreate}>
              Nuevo movimiento
            </Button>
          </div>

          <hr />

          <Row>
            <Col md={4}>
              <p>
                <strong>Cliente:</strong> {account.client}
              </p>
            </Col>
            <Col md={4}>
              <p className="text-center">
                {account.balance < 0 && (
                  <Badge className="fs-6" bg="danger">
                    Saldo:
                    {account.currency.is_monetary ? " $" : " "}
                    {toMoney(account.balance)} {account.currency.symbol}
                  </Badge>
                )}
                {account.balance == 0 && (
                  <Badge className="fs-6" bg="secondary">
                    Saldo:
                    {account.currency.is_monetary ? " $" : " "}
                    {toMoney(account.balance)} {account.currency.symbol}
                    {account.currency.symbol}
                  </Badge>
                )}
                {account.balance > 0 && (
                  <Badge className="fs-6" bg="success">
                    Saldo:
                    {account.currency.is_monetary ? " $" : " "}
                    {toMoney(account.balance)} {account.currency.symbol}
                  </Badge>
                )}
              </p>
            </Col>
          </Row>

          <Datatable
            title={`Listado de movimientos de cuenta corriente proyecto en ${account.currency.name}`}
            columns={columns as TableColumn<DataRow>[]}
            data={state.data}
            loading={state.loading}
            totalRows={state.totalRows}
            handleRowsPerPageChange={handleRowsPerPageChange}
            handlePageChange={handlePageChange}
          />

          <Modal show={isModalOpen} onHide={() => handleClose()} size="lg">
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
                <Row>
                  <Col xs={4}>
                    <InputGroup className="mb-3" size="sm">
                      <InputGroup.Text>Monto</InputGroup.Text>
                      <NumericFormat
                        // prefix="$"
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        className="text-end form-control"
                        // value={formData.amount}
                        required
                        onValueChange={(values) => {
                          const { floatValue } = values;
                          // setFormData({ ...formData, amount: floatValue || 0 });
                        }}
                      />
                    </InputGroup>
                  </Col>
                  <Col xs={4}>
                    <InputGroup className="mb-3" size="sm">
                      <InputGroup.Text>Moneda</InputGroup.Text>
                      <select name="currency" className="form-select" required>
                        {currencies.map((currency: any) => (
                          <option key={currency.id} value={currency.id}>
                            {currency.name}
                          </option>
                        ))}
                      </select>
                    </InputGroup>
                  </Col>
                  <Col xs={4}>
                    <InputGroup className="mb-3" size="sm">
                      <InputGroup.Text>Equivalente</InputGroup.Text>
                      <NumericFormat
                        // prefix="$"
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        className="text-end form-control"
                        value={formData.amount}
                        required
                        onValueChange={(values) => {
                          const { floatValue } = values;
                          // setFormData({ ...formData, amount: floatValue || 0 });
                        }}
                      />
                    </InputGroup>
                  </Col>
                </Row>

                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cerrar
                  </Button>
                  <Button size="sm" variant="primary" type="submit">
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
