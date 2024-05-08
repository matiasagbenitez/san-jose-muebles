import React, { useState, useEffect, useReducer } from "react";
import {
  Button,
  Modal,
  Form,
  InputGroup,
  Row,
  Col,
  Badge,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { DayJsAdapter, convertToMoney } from "../../../helpers";

import { NumericFormat } from "react-number-format";
import { SweetAlert2 } from "../../utils";

import { TableColumn } from "react-data-table-component";
import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";

interface AccountInterface {
  id: number;
  supplier: string;
  currency: string;
  symbol: string;
  is_monetary: boolean;
  balance: number;
}

enum MovementType {
  NEW_PURCHASE = "NEW_PURCHASE",
  DEL_PURCHASE = "DEL_PURCHASE",
  NEW_PAYMENT = "NEW_PAYMENT",
  POS_ADJ = "POS_ADJ",
  NEG_ADJ = "NEG_ADJ",
}

const types: Record<
  MovementType,
  { label: string; icon: string; title: string }
> = {
  [MovementType.NEW_PURCHASE]: {
    label: "NUEVA COMPRA",
    icon: "bi bi-arrow-down-circle-fill fs-6 text-danger",
    title: "Aumenta la deuda con el proveedor",
  },
  [MovementType.DEL_PURCHASE]: {
    label: "COMPRA ANULADA",
    icon: "bi bi-x-circle-fill fs-6 text-secondary",
    title: "Disminuye la deuda con el proveedor",
  },
  [MovementType.NEW_PAYMENT]: {
    label: "PAGO PROPIO",
    icon: "bi bi-arrow-up-circle-fill fs-6 text-success",
    title: "Disminuye la deuda con el proveedor",
  },
  [MovementType.POS_ADJ]: {
    label: "AJUSTE A FAVOR",
    icon: "bi bi-arrow-up-circle-fill fs-6 text-success",
    title: "Disminuye la deuda con el proveedor",
  },
  [MovementType.NEG_ADJ]: {
    label: "AJUSTE EN CONTRA",
    icon: "bi bi-arrow-down-circle-fill fs-6 text-danger",
    title: "Aumenta la deuda con el proveedor",
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
  description: string;
  type: string;
  prev_balance: number;
  amount: number;
  post_balance: number;
  id_purchase?: number;
  id_project?: number;
}

export const SupplierAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = `/supplier_account_transactions/${id}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<AccountInterface | null>(null);

  const [formData, setFormData] = useState(initialForm);

  const fetch = async () => {
    const [_, res2] = await Promise.all([
      fetchData(endpoint, 1, state, dispatch),
      apiSJM.get(`/supplier_accounts/${id}`),
    ]);
    setAccount(res2.data.account);
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
      selector: (row: any) => row.createdAt,
      format: (row: DataRow) => (
        <>
          {DayJsAdapter.toDayMonthYearHour(row.createdAt)}
          <i
            className="bi bi-person ms-2"
            title={`Movimiento registrado por ${row.user}`}
          ></i>
        </>
      ),
      maxWidth: "160px",
      center: true,
    },
    {
      name: "RESPONSABLE",
      selector: (row: DataRow) => row.user,
      maxWidth: "140px",
      center: true,
      omit: true,
    },
    {
      name: "DESCRIPCIÓN",
      selector: (row: DataRow) => row.description,
      cell: (row: DataRow) => {
        return (
          <>
            {row.id_purchase && (
              <Button
                size="sm"
                variant="link"
                onClick={() => handleRedirectPurchase(row.id_purchase!)}
                className="p-0 text-start"
              >
                <small>{row.description}</small>
              </Button>
            )}
            {!row.id_purchase && row.description && (
              <span>{row.description}</span>
            )}
          </>
        );
      },
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
      maxWidth: "200px",
    },
    {
      name: "SALDO ANTERIOR",
      selector: (row: DataRow) => convertToMoney(row.prev_balance),
      maxWidth: "160px",
      right: true,
    },
    {
      name: "MONTO MOVIMIENTO",
      maxWidth: "160px",
      selector: (row: DataRow) => convertToMoney(row.amount),
      right: true,
      style: { fontWeight: "bold", background: "#f0f0f0", fontSize: "1.1em" },
    },
    {
      name: "SALDO POSTERIOR",
      maxWidth: "160px",
      selector: (row: DataRow) => convertToMoney(row.post_balance),
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

  const handleRedirectPurchase = (id_purchase: number) => {
    navigate(`/compras/${id_purchase}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (formData.amount <= 0) {
        SweetAlert2.errorAlert("¡El monto del movimiento debe ser mayor a 0!");
        return;
      }
      setIsFormSubmitting(true);
      const confirmation = await SweetAlert2.confirm(
        "¿Está seguro de registrar el movimiento?"
      );
      if (!confirmation.isConfirmed) return;
      setLoading(true);
      const { data } = await apiSJM.post(
        "/supplier_account_transactions/new-movement",
        { ...formData, id_supplier_account: id }
      );
      SweetAlert2.successAlert(data.message);
      handleClose();
      fetch();
    } catch (error: any) {
      console.error(error);
      // SweetAlert2.errorAlert(error.response.data.message);
      SweetAlert2.errorAlert(
        "¡Ocurrió un error al registrar el movimiento! Intente nuevamente."
      );
    } finally {
      setIsFormSubmitting(false);
      setLoading(false);
    }
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Pago de cliente a proveedor</Popover.Header>
      <Popover.Body>
        Para registrar un
        <b> pago de cliente a proveedor </b> como pago de su proyecto, el mismo
        debe registrarse en la cuenta corriente del proyecto cuya moneda
        coincide con la de la cuenta corriente del proveedor. Una vez registrado
        el pago, el mismo se verá reflejado tanto en la cuenta corriente del
        proyecto como en la cuenta corriente del proveedor.
      </Popover.Body>
    </Popover>
  );

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
                onClick={() => navigate(-1)}
                title="Volver al detalle del proveedor"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Atrás
              </Button>
              <h1 className="fs-5 my-0">Cuenta corriente {account.supplier}</h1>
            </div>
            <Button size="sm" variant="success" onClick={handleCreate}>
              Nuevo movimiento
            </Button>
          </div>

          <hr />

          <Row>
            <Col md={4}>
              <p>
                <strong>Proveedor:</strong> {account.supplier}
              </p>
            </Col>
            <Col md={4}>
              <p className="text-center">
                {account.balance < 0 && (
                  <Badge className="fs-6" bg="danger">
                    Saldo: {account.symbol} {convertToMoney(account.balance)}
                  </Badge>
                )}
                {account.balance == 0 && (
                  <Badge className="fs-6" bg="secondary">
                    Saldo: {account.symbol} {convertToMoney(account.balance)}
                  </Badge>
                )}
                {account.balance > 0 && (
                  <Badge className="fs-6" bg="success">
                    Saldo: {account.symbol} {convertToMoney(account.balance)}
                  </Badge>
                )}
              </p>
            </Col>
          </Row>

          <Datatable
            title={`Listado de movimientos de cuenta corriente en ${
              account.currency
            } ${flags[account.symbol] || ""}`}
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
                <InputGroup size="sm">
                  <InputGroup.Text>Tipo de movimiento</InputGroup.Text>
                  <Form.Select
                    required
                    name="type"
                    onChange={(e: any) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    disabled={isFormSubmitting}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="NEW_PAYMENT">Pago propio a proveedor</option>
                    <option value="POS_ADJ">
                      Ajuste a favor (disminuye deuda c/ proveedor)
                    </option>
                    <option value="NEG_ADJ">
                      Ajuste en contra (aumenta deuda c/ proveedor)
                    </option>
                  </Form.Select>
                </InputGroup>

                <OverlayTrigger
                  trigger="click"
                  placement="left"
                  overlay={popover}
                >
                  <Button
                    variant="link"
                    className="p-0 m-0 text-decoration-none text-muted"
                    style={{ fontSize: "0.88em" }}
                  >
                    <small>
                      ¿Desea registrar el pago de un cliente al proveedor?
                    </small>
                  </Button>
                </OverlayTrigger>
                {/* DESCRIPCIÓN */}
                <InputGroup className="mt-2 mb-3" size="sm">
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
                    disabled={isFormSubmitting}
                  />
                </InputGroup>
                {/* MONTO */}
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>Monto movimiento</InputGroup.Text>
                  <NumericFormat
                    prefix="$"
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    className="text-end form-control"
                    value={formData.amount}
                    required
                    onValueChange={(values) => {
                      const { floatValue } = values;
                      setFormData({ ...formData, amount: floatValue || 1 });
                    }}
                    disabled={isFormSubmitting}
                  />
                </InputGroup>
                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isFormSubmitting}
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
