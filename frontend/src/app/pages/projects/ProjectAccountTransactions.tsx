import React, { useState, useEffect, useReducer } from "react";
import { Button, Modal, Form, InputGroup, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, PageHeader } from "../../components";

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
  AccountCurrency,
  ParamsInterface,
} from "./interfaces";
import { DateFormatter, NumberFormatter } from "../../helpers";

interface InitialForm {
  type: string;
  description: string;
  amount: number;
  id_currency: string;
  equivalent_amount: number;
  id_supplier_account?: string;
}

const initialForm: InitialForm = {
  type: "",
  description: "",
  amount: 0,
  id_currency: "",
  equivalent_amount: 0,
};

export const ProjectAccountTransactions = () => {
  const { id: id_project, id_project_account } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = `/project_account_transactions/${id_project_account}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<AccountInterface>();
  const [accountCurrency, setAccountCurrency] = useState<AccountCurrency>();
  const [disabledEquivalent, setDisabledEquivalent] = useState(false);
  const [isFormSubmiting, setIsFormSubmiting] = useState(false);

  const [currencies, setCurrencies] = useState<ParamsInterface[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [supplierAccounts, setSupplierAccounts] = useState([]);

  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2, _] = await Promise.all([
        apiSJM.get(
          `/project_accounts/project/${id_project}/account/${id_project_account}`
        ),
        apiSJM.get("/currencies"),
        fetchData(endpoint, 1, state, dispatch),
      ]);
      setAccount(res1.data.account);
      setCurrencies(res2.data.items);
      setAccountCurrency(res1.data.account.currency);
      const disabled = res1.data.account.currency.id == res2.data.items[0].id;
      setDisabledEquivalent(disabled);
      setLoading(false);
    } catch (error) {
      navigate("/proyectos");
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
          {DateFormatter.toDMYH(row.createdAt)}
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
      name: "DESCRIPCIÓN",
      selector: (row: DataRow) => row.description,
      format: (row: DataRow) => (
        <div className="text-break" style={{ maxWidth: "500px" }}>
          {row.supplier && (
            <Button
              size="sm"
              variant="link"
              onClick={() => handleRedirectSupplierPayment(row.supplier!)}
              className="p-0 text-start"
            >
              <small>
                PAGO A PROVEEDOR N° {row.supplier.id_movement} -{" "}
                {row.supplier.supplier}
              </small>
            </Button>
          )}
          {!row.supplier && row.description && <span>{row.description}</span>}
        </div>
      ),
    },
    {
      name: "TIPO MOVIMIENTO",
      // hide: "lg" as Media, // import from 'react-data-table-component'
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
      name: "IMPORTE",
      selector: (row: DataRow) => row.received_amount,
      format: (row: DataRow) => (
        <>
          <small className="text-muted">{`${row.currency} `}</small>
          {NumberFormatter.formatNotsignedCurrency(
            row.is_monetary === true,
            row.received_amount
          )}
        </>
      ),
      maxWidth: "145px",
      right: true,
    },
    {
      name: "SALDO ANTERIOR",
      selector: (row: DataRow) => row.prev_balance,
      format: (row: DataRow) => {
        return (
          <>
            <small className="text-muted">{`${
              accountCurrency!.symbol
            } `}</small>
            {NumberFormatter.formatSignedCurrency(
              accountCurrency!.is_monetary,
              row.prev_balance
            )}
          </>
        );
      },
      maxWidth: "145px",
      right: true,
    },
    {
      name: `IMPORTE REAL (${accountCurrency?.symbol})`,
      maxWidth: "160px",
      selector: (row: DataRow) => row.equivalent_amount,
      format: (row: DataRow) => {
        return (
          <>
            <small className="text-muted">{`${
              accountCurrency!.symbol
            } `}</small>
            {NumberFormatter.formatSignedCurrency(
              accountCurrency!.is_monetary,
              row.equivalent_amount
            )}
          </>
        );
      },
      right: true,
      style: { fontWeight: "bold", background: "#f0f0f0", fontSize: "1.1em" },
    },
    {
      name: "SALDO POSTERIOR",
      maxWidth: "145px",
      selector: (row: DataRow) => row.post_balance,
      format: (row: DataRow) => {
        return (
          <>
            <small className="text-muted">{`${
              accountCurrency!.symbol
            } `}</small>
            {NumberFormatter.formatSignedCurrency(
              accountCurrency!.is_monetary,
              row.post_balance
            )}
          </>
        );
      },
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsFormSubmiting(true);
      const confirmation = await SweetAlert2.confirm(
        "¿Está seguro de registrar el movimiento?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post(
        "/project_account_transactions/new-movement",
        { ...formData, id_project_account }
      );
      SweetAlert2.successToast(
        data.message || "¡Movimiento registrado correctamente!"
      );
      fetch();
      handleClose();
    } catch (error: any) {
      console.error(error);
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmiting(false);
    }
  };

  // USEFFECTS PARA MANEJAR EL CAMBIO DE MONEDA
  useEffect(() => {
    if (accountCurrency) {
      if (formData.id_currency == accountCurrency.id) {
        setDisabledEquivalent(true);
        setFormData({ ...formData, equivalent_amount: formData.amount });
      } else {
        setDisabledEquivalent(false);
        setFormData({ ...formData, equivalent_amount: 0 });
      }
    }

    if (!formData.id_currency) {
      setFormData({ ...formData, id_supplier_account: "" });
    }
  }, [formData.id_currency]);

  useEffect(() => {
    if (disabledEquivalent) {
      setFormData({ ...formData, equivalent_amount: formData.amount });
    }
  }, [formData.amount]);

  useEffect(() => {
    if (formData.type === "NEW_SUPPLIER_PAYMENT" && formData.id_currency) {
      fetchSuppliers();
    } else {
      setSupplierAccounts([]);
    }
  }, [formData.type, formData.id_currency]);

  const handleRedirect = (row: DataRow) => {
    navigate(
      `/proyectos/${id_project}/cuentas/${id_project_account}/movimiento/${row.id}`
    );
  };

  const fetchSuppliers = async () => {
    if (!formData.id_currency) return [];
    try {
      const { data } = await apiSJM.get(
        `/supplier_accounts/by-currency/${formData.id_currency}`
      );
      setSupplierAccounts(data.items);
    } catch (error) {
      return [];
    }
  };

  const handleRedirectSupplierPayment = (supplier: any) => {
    const url = `/cuentas-proveedores/${supplier.id_account}/movimiento/${supplier.id_movement}`;
    console.log(url);
    navigate(
      `/cuentas-proveedores/${supplier.id_account}/movimiento/${supplier.id_movement}`
    );
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && account && accountCurrency && (
        <>
          <PageHeader
            goBackTo={`/proyectos/${id_project}/cuentas`}
            goBackTitle="Volver al detalle de cuentas"
            title="Detalle de cuenta corriente proyecto"
            handleAction={handleCreate}
            actionButtonText="Nuevo movimiento"
          />

          {/* PROJECT ACCOUNT INFO */}
          <Row className="mb-3">
            <Col xs={12} xl={4}>
              <p className="text-muted">
                Cliente: <span className="fw-bold">{account.client}</span>
              </p>
            </Col>
            <Col xs={12} xl={5}>
              <p className="text-muted">
                Proyecto:{" "}
                <span className="fw-bold">
                  {account.title || "Sin título especificado"} (
                  {account.locality})
                </span>
              </p>
            </Col>
            <Col xs={12} xl={3}>
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
            <Col xs={12} xl={4}>
              <p className="text-muted">
                Moneda:{" "}
                <span className="fw-bold">
                  {account.currency.name} ({account.currency.symbol})
                </span>
              </p>
            </Col>
            <Col xs={12} xl={5}>
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

          {/* DATATABLE */}
          <Datatable
            title="Listado de últimos movimientos"
            columns={columns as TableColumn<DataRow>[]}
            data={state.data}
            loading={state.loading}
            totalRows={state.totalRows}
            handleRowsPerPageChange={handleRowsPerPageChange}
            handlePageChange={handlePageChange}
            clickableRows
            onRowClicked={handleRedirect}
          />

          {/* FORMULARIO NUEVO MOVIMIENTO */}
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
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFormData({ ...formData, type: e.target.value });
                    }}
                    disabled={isFormSubmiting}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="NEW_PAYMENT">
                      Pago del cliente a la empresa
                    </option>
                    <option value="NEW_SUPPLIER_PAYMENT">
                      Pago del cliente a un proveedor
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
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    disabled={isFormSubmiting}
                  />
                </InputGroup>

                {/* MONTO */}
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>Monto</InputGroup.Text>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    className="text-end form-control"
                    value={formData.amount}
                    onValueChange={(values) => {
                      const { floatValue } = values;
                      setFormData({
                        ...formData,
                        amount: floatValue || 0,
                      });
                    }}
                    disabled={isFormSubmiting}
                    required
                  />

                  <Form.Select
                    required
                    name="id_currency"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFormData({
                        ...formData,
                        id_currency: e.target.value,
                      });
                    }}
                    disabled={isFormSubmiting}
                  >
                    <option value="">Seleccione una moneda</option>
                    {currencies.map((item: ParamsInterface) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>

                {formData.type === "NEW_SUPPLIER_PAYMENT" && (
                  <InputGroup className="mb-3" size="sm">
                    <InputGroup.Text>
                      Cuenta corriente proveedor
                    </InputGroup.Text>
                    <Form.Select
                      required
                      name="id_supplier_account"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setFormData({
                          ...formData,
                          id_supplier_account: e.target.value,
                        });
                      }}
                      disabled={isFormSubmiting || !formData.id_currency}
                    >
                      <option value="">Seleccione una opción</option>
                      {supplierAccounts.map((item: any) => (
                        <option
                          key={item.id}
                          value={item.id}
                          style={{ color: item.balance < 0 ? "red" : "" }}
                        >
                          {item.supplier} Saldo: {item.currency}{" "}
                          {NumberFormatter.formatSignedCurrency(
                            true,
                            item.balance
                          )}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                )}

                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>Equivalentes a</InputGroup.Text>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    className="text-end form-control"
                    value={formData.equivalent_amount}
                    disabled={disabledEquivalent || isFormSubmiting}
                    required
                    onValueChange={(values) => {
                      const { floatValue } = values;
                      setFormData({
                        ...formData,
                        equivalent_amount: floatValue || 0,
                      });
                    }}
                  />
                  <InputGroup.Text>{accountCurrency.name}</InputGroup.Text>
                </InputGroup>

                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cerrar
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    type="submit"
                    disabled={isFormSubmiting}
                  >
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
