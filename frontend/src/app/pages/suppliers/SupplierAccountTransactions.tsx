import { useState, useEffect, useReducer, useMemo } from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Popover,
  OverlayTrigger,
  ButtonGroup,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, PageHeader, CustomInput } from "../../components";

import { SweetAlert2 } from "../../utils";

import { TableColumn } from "react-data-table-component";
import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
  ColumnOmitter,
  ColumnsHiddenInterface,
} from "../../shared";

import { DateFormatter, NumberFormatter } from "../../helpers";

import {
  SupplierAccountInterface,
  types,
  DataRow,
  InitialFormInterface,
  Movements,
} from "./interfaces";

const initialForm: InitialFormInterface = {
  type: "",
  description: "",
  amount: 0,
};

const columnsHidden = {
  id: { name: "ID", omit: false },
  createdAt: { name: "FECHA", omit: false },
  prev_balance: { name: "SALDO ANTERIOR", omit: true },
  amount: { name: "MONTO MOVIMIENTO", omit: false },
  post_balance: { name: "SALDO POSTERIOR", omit: false },
  type: { name: "TIPO MOVIMIENTO", omit: false },
  description: { name: "DESCRIPCIÓN", omit: false },
};

export const SupplierAccountTransactions = () => {
  const { id: id_supplier, id_supplier_account } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = `/supplier_account_transactions/${id_supplier_account}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<SupplierAccountInterface | null>(null);
  const [prefix, setPrefix] = useState("");

  const [omittedColumns, setOmittedColumns] =
    useState<ColumnsHiddenInterface>(columnsHidden);

  const fetch = async () => {
    try {
      setLoading(true);
      const [_, res2] = await Promise.all([
        fetchData(endpoint, 1, state, dispatch),
        apiSJM.get(`/supplier_accounts/supplier/${id_supplier}/account/${id_supplier_account}`),
      ]);
      setAccount(res2.data.item);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate(`/proveedores/${id_supplier}/cuentas`);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (account) {
      const { currency } = account;
      const aux = currency.is_monetary
        ? `${currency.symbol} $`
        : `${currency.symbol} `;
      setPrefix(aux);
    }
  }, [account]);

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

  const columns: TableColumn<DataRow>[] = useMemo(
    () => [
      {
        name: "ID",
        selector: (row: DataRow) => row.id,
        width: "80px",
        center: true,
        omit: omittedColumns.id.omit,
      },
      {
        name: "FECHA",
        selector: (row: any) => DateFormatter.toDMYYYY(row.createdAt),
        maxWidth: "110px",
        center: true,
        omit: omittedColumns.createdAt.omit,
      },
      {
        name: "SALDO ANTERIOR",
        maxWidth: "160px",
        selector: (row: DataRow) =>
          NumberFormatter.formatSignedCurrency(
            account?.currency.is_monetary,
            row.prev_balance
          ),
        right: true,
        conditionalCellStyles: [
          {
            when: (row: DataRow) => row.prev_balance < 0,
            style: { color: "red" },
          },
        ],
        omit: omittedColumns.prev_balance.omit,
      },
      {
        name: "MONTO MOVIMIENTO",
        maxWidth: "160px",
        selector: (row: DataRow) =>
          NumberFormatter.formatSignedCurrency(
            account?.currency.is_monetary,
            row.amount
          ),
        right: true,
        conditionalCellStyles: [
          { when: (row: DataRow) => row.amount < 0, style: { color: "red" } },
        ],
        style: { fontWeight: "bold", background: "#f0f0f0", fontSize: "1em" },
        omit: omittedColumns.amount.omit,
      },
      {
        name: "SALDO POSTERIOR",
        maxWidth: "160px",
        selector: (row: DataRow) =>
          NumberFormatter.formatSignedCurrency(
            account?.currency.is_monetary,
            row.post_balance
          ),
        right: true,
        conditionalCellStyles: [
          {
            when: (row: DataRow) => row.post_balance < 0,
            style: { color: "red" },
          },
        ],
        omit: omittedColumns.post_balance.omit,
      },
      {
        name: "TIPO MOVIMIENTO",
        selector: (row: DataRow) => row.type,
        format: (row: DataRow) => (
          <>
            <i
              className={types[row.type].icon}
              title={types[row.type].title}
            ></i>{" "}
            {types[row.type].label}
          </>
        ),
        maxWidth: "200px",
        wrap: true,
        omit: omittedColumns.type.omit,
      },
      {
        name: "DESCRIPCIÓN",
        selector: (row: DataRow) => row.description,
        wrap: true,
        format: (row: DataRow) => (
          <>
            {row.id_purchase && (
              <>
                {row.description}
                {" | "}
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => handleRedirectPurchase(row.id_purchase!)}
                  className="p-0 ms-1"
                  title="Ver detalle de compra"
                >
                  <small>Ver detalle</small>
                </Button>
              </>
            )}
            {row.project && (
              <>
                PAGO DE CLIENTE (
                <Link
                  to={`/proyectos/${row.project.id_project}/cuentas/${row.project.id_account}}`}
                >
                  {row.project.client}
                </Link>
                {" | "}
                ID: {row.project.id_movement})
              </>
            )}
            {!row.id_purchase && !row.project && row.description && (
              <>{row.description}</>
            )}
          </>
        ),
        omit: omittedColumns.description.omit,
      },
    ],
    [account, types, omittedColumns]
  );

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleRedirectPurchase = (id_purchase: number) => {
    navigate(`/compras/${id_purchase}`);
  };

  const handleSubmit = async (values: InitialFormInterface) => {
    try {
      const amount = NumberFormatter.toDecimal(values.amount);
      const type = Movements[values.type as keyof typeof Movements];
      const message = `¿Registrar un movimiento ${type} por un monto de ${prefix}${amount}?`;
      const confirmation = await SweetAlert2.confirm(message);
      if (!confirmation.isConfirmed) return;
      setIsFormSubmitting(true);
      const { data } = await apiSJM.post(
        "/supplier_account_transactions/new-movement",
        { ...values, id_supplier_account }
      );
      SweetAlert2.successAlert(data.message);
      handleClose();
      fetch();
    } catch (error: any) {
      console.error(error);
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitting(false);
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
    navigate(
      `/proveedores/${id_supplier}/cuentas/${id_supplier_account}/movimiento/${row.id}`
    );
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && account && (
        <>
          <PageHeader
            goBackTo={`/proveedores/${account.supplier.id}/cuentas`}
            goBackTitle="Volver al listado de cuentas corrientes"
            title="Detalle de cuenta corriente proveedor"
            handleAction={handleCreate}
            actionButtonText="Nuevo movimiento"
          />

          <Row className="mb-3 mb-xl-0">
            <Col xs={12} xl={7}>
              <p className="text-muted fw-bold">
                {account.supplier.name}
                {" - "}
                <span className="fw-normal text-dark">
                  CUENTA CORRIENTE EN{" "}
                  <b>
                    {account.currency.name} ({account.currency.symbol})
                  </b>
                </span>
              </p>
            </Col>

            <Col xs={12} xl={3}>
              <b>SALDO ACTUAL:</b>
              <span
                className={`px-2 text-end fw-bold text-${
                  account.balance < 0
                    ? "danger"
                    : account.balance == 0
                    ? "muted"
                    : "success"
                }`}
              >
                <span className="text-dark fw-normal me-1">
                  {account.currency.symbol}
                </span>
                {NumberFormatter.formatSignedCurrency(
                  account.currency.is_monetary,
                  account.balance
                )}
              </span>
            </Col>
            
            <Col xs={12} xl={2}>
              <ColumnOmitter
                omittedColumns={omittedColumns}
                setOmittedColumns={setOmittedColumns}
              />
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

          <Modal show={isModalOpen} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Nuevo movimiento</Modal.Title>
            </Modal.Header>

            <Formik
              initialValues={initialForm}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
              validationSchema={Yup.object({
                type: Yup.string().required(
                  "El tipo de movimiento es requerido"
                ),
                description: Yup.string().required(
                  "La descripción es requerida"
                ),
                amount: Yup.number()
                  .required("El monto es requerido")
                  .min(1, "El monto debe ser mayor a 0"),
              })}
            >
              {({ errors, touched, values, setFieldValue }) => (
                <Form id="form">
                  <Modal.Body>
                    <CustomInput.Select
                      label="Tipo de movimiento"
                      name="type"
                      isInvalid={!!errors.type && touched.type}
                      disabled={isFormSubmitting}
                      isRequired
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="NEW_PAYMENT">
                        Pago propio a proveedor
                      </option>
                      <option value="POS_ADJ">
                        Ajuste a favor (disminuye deuda c/ proveedor)
                      </option>
                      <option value="NEG_ADJ">
                        Ajuste en contra (aumenta deuda c/ proveedor)
                      </option>
                    </CustomInput.Select>

                    <OverlayTrigger
                      trigger="click"
                      placement="left"
                      overlay={popover}
                    >
                      <Button
                        variant="link"
                        className="p-0 mb-1 text-decoration-none text-muted"
                        style={{ fontSize: "0.88em" }}
                      >
                        <small>
                          ¿Desea registrar el pago de un cliente al proveedor?
                        </small>
                      </Button>
                    </OverlayTrigger>

                    <CustomInput.Text
                      label="Descripción"
                      name="description"
                      placeholder="Ingrese la descripción del movimiento"
                      isInvalid={!!errors.description && touched.description}
                      disabled={isFormSubmitting}
                      isRequired
                    />

                    <CustomInput.Decimal
                      label="Monto movimiento"
                      name="amount"
                      value={values.amount}
                      onValueChange={(value) => {
                        setFieldValue("amount", value.floatValue || 0);
                      }}
                      isInvalid={!!errors.amount && touched.amount}
                      min={1}
                      disabled={isFormSubmitting}
                      isRequired
                      prefix={prefix}
                    />
                  </Modal.Body>

                  <Modal.Footer>
                    <ButtonGroup size="sm">
                      <Button
                        variant="secondary"
                        disabled={isFormSubmitting}
                        onClick={handleClose}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isFormSubmitting}
                      >
                        <i className="bi bi-floppy mx-1"></i>{" "}
                        {isFormSubmitting
                          ? "Guardando..."
                          : "Registrar movimiento"}
                      </Button>
                    </ButtonGroup>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal>
        </>
      )}
    </>
  );
};
