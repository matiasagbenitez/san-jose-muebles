import React, { useState, useEffect, useReducer } from "react";
import {
  Button,
  Modal,
  Form,
  InputGroup,
  Row,
  Col,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
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
import { DateFormatter, NumberFormatter } from "../../helpers";

interface AccountInterface {
  id: number;
  supplier: {
    id: number;
    name: string;
    locality: string;
  };
  currency: {
    name: string;
    symbol: string;
    is_monetary: boolean;
  };
  balance: number;
}

enum MovementType {
  NEW_PURCHASE = "NEW_PURCHASE",
  DEL_PURCHASE = "DEL_PURCHASE",
  NEW_PAYMENT = "NEW_PAYMENT",
  NEW_CLIENT_PAYMENT = "NEW_CLIENT_PAYMENT",
  DEL_CLIENT_PAYMENT = "DEL_CLIENT_PAYMENT",
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
  [MovementType.NEW_CLIENT_PAYMENT]: {
    label: "PAGO DE CLIENTE",
    icon: "bi bi-arrow-up-circle-fill fs-6 text-success",
    title: "Disminuye la deuda con el proveedor",
  },
  [MovementType.DEL_CLIENT_PAYMENT]: {
    label: "PAGO DE CLIENTE ANULADO",
    icon: "bi bi-x-circle-fill fs-6 text-secondary",
    title: "Aumenta la deuda con el proveedor",
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

const initialForm = {
  type: "",
  description: "",
  amount: 0,
};

interface ProjectInterface {
  id_project: number;
  id_account: number;
  id_movement: number;
  client: string;
}
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
  project?: ProjectInterface;
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
    setAccount(res2.data.item);
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
      name: "RESPONSABLE",
      selector: (row: DataRow) => row.user,
      maxWidth: "140px",
      center: true,
      omit: true,
    },
    {
      name: "DESCRIPCIÓN",
      selector: (row: DataRow) => row.description,
      format: (row: DataRow) => (
        <div className="text-wrap">
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
          {row.project && (
            <>
              PAGO DE CLIENTE ({row.project.client} | ID PAGO {row.project.id_movement}){" "}
              <Button
                size="sm"
                variant="link"
                onClick={() => handleRedirectClientPayment(row.project!)}
                className="p-0 ps-1 text-start"
                title="Ver detalle del movimiento en cuenta del cliente"
              >
                <small>Ver cuenta</small>
              </Button>
            </>
          )}
          {!row.id_purchase && !row.project && row.description && (
            <span>{row.description}</span>
          )}
        </div>
      ),
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
      selector: (row: DataRow) =>
        NumberFormatter.toDecimalMoney(row.prev_balance),
      maxWidth: "145px",
      right: true,
    },
    {
      name: "MONTO MOVIMIENTO",
      maxWidth: "145px",
      selector: (row: DataRow) => NumberFormatter.toDecimalMoney(row.amount),
      right: true,
      style: { fontWeight: "bold", background: "#f0f0f0", fontSize: "1.1em" },
    },
    {
      name: "SALDO POSTERIOR",
      maxWidth: "145px",
      selector: (row: DataRow) =>
        NumberFormatter.toDecimalMoney(row.post_balance),
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

  const handleRedirectClientPayment = (project: ProjectInterface) => {
    navigate(
      `/proyectos/${project.id_project}/cuentas/${project.id_account}}`
    );
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

  const handleRedirect = (row: DataRow) => {
    navigate(`/cuentas-proveedores/${id}/movimiento/${row.id}`);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && account && (
        <>
          <PageHeader
            goBackTo={`/proveedores/${account.supplier.id}/cuentas-proveedores`}
            goBackTitle="Volver al listado de cuentas corrientes"
            title="Detalle de cuenta corriente proveedor"
            handleAction={handleCreate}
            actionButtonText="Nuevo movimiento"
          />

          <Row className="mb-3">
            <Col xs={12} xl={4}>
              <p className="text-muted">
                Proveedor:{" "}
                <span className="fw-bold">{account.supplier.name}</span>
              </p>
            </Col>
            <Col xs={12} xl={4}>
              <p className="text-muted">
                Localidad:{" "}
                <span className="fw-bold">{account.supplier.locality}</span>
              </p>
            </Col>
            <Col xs={12} xl={4}>
              <p className="text-muted">
                Cuenta:{" "}
                <span className="fw-bold">
                  {account.currency.name} ({account.currency.symbol})
                </span>
              </p>
            </Col>
            <Col xs={12} xl={4}>
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
            title={`Listado de últimos movimientos`}
            columns={columns as TableColumn<DataRow>[]}
            data={state.data}
            loading={state.loading}
            totalRows={state.totalRows}
            handleRowsPerPageChange={handleRowsPerPageChange}
            handlePageChange={handlePageChange}
            clickableRows
            onRowClicked={handleRedirect}
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
