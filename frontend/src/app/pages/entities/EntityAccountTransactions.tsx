import { useState, useEffect, useReducer, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Row, Col, ButtonGroup } from "react-bootstrap";

import { LoadingSpinner, PageHeader, CustomInput } from "../../components";
import { DateFormatter, NumberFormatter } from "../../helpers";
import { SweetAlert2 } from "../../utils";
import apiSJM from "../../../api/apiSJM";

import { TableColumn } from "react-data-table-component";
import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
  ColumnOmitter,
  ColumnsHiddenInterface,
} from "../../shared";

import {
  MovementType,
  types,
  AccountInterface,
  InitialFormInterface,
  Movements,
} from "./interfaces";

const initialForm: InitialFormInterface = {
  type: "",
  description: "",
  amount: 0,
};

interface DataRow {
  id: number;
  createdAt: Date;
  user: string;
  description: string;
  type: MovementType;
  prev_balance: number;
  amount: number;
  post_balance: number;
}

const columnsHidden = {
  id: { name: "ID", omit: false },
  createdAt: { name: "FECHA", omit: false },
  prev_balance: { name: "SALDO ANTERIOR", omit: true },
  amount: { name: "MONTO MOVIMIENTO", omit: false },
  post_balance: { name: "SALDO POSTERIOR", omit: false },
  type: { name: "TIPO MOVIMIENTO", omit: false },
  description: { name: "DESCRIPCIÓN", omit: false },
};

export const EntityAccountTransactions = () => {
  const { id: id_entity, id_entity_account } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = `/entity_account_transactions/${id_entity_account}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [prefix, setPrefix] = useState("");

  const [omittedColumns, setOmittedColumns] =
    useState<ColumnsHiddenInterface>(columnsHidden);

  const fetch = async () => {
    try {
      setLoading(true);
      const [_, res2] = await Promise.all([
        fetchData(endpoint, 1, state, dispatch),
        apiSJM.get(
          `/entity_accounts/entity/${id_entity}/account/${id_entity_account}`
        ),
      ]);
      setAccount(res2.data.account);
      setLoading(false);
    } catch (error) {
      console.error(error);
      navigate(`/entidades/${id_entity}/cuentas`);
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

  const handleRedirect = (row: DataRow) => {
    navigate(
      `/entidades/${id_entity}/cuentas/${id_entity_account}/movimiento/${row.id}`
    );
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
        "/entity_account_transactions/new-movement",
        { ...values, id_entity_account }
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

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && account && (
        <>
          <PageHeader
            goBackTo={`/entidades/${id_entity}/cuentas`}
            goBackTitle="Volver al listado de cuentas corrientes"
            title="Detalle de cuenta corriente entidad"
            handleAction={handleCreate}
            actionButtonText="Nuevo movimiento"
          />

          <Row className="mb-3 mb-xl-0">
            <Col xs={12} xl={7}>
              <p className="text-muted fw-bold">
                {account.entity}
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
                      <option value="">Seleccione un tipo de movimiento</option>
                      <option value="PAYMENT">Pago o cancelación</option>
                      <option value="DEBT">Deuda u obligación</option>
                      <option value="POS_ADJ">
                        Ajuste a favor (disminuye deuda)
                      </option>
                      <option value="NEG_ADJ">
                        Ajuste en contra (aumenta deuda)
                      </option>
                    </CustomInput.Select>

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
                      <Button variant="secondary" disabled={isFormSubmitting} onClick={handleClose}>
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isFormSubmitting}
                      >
                        <i className="bi bi-floppy mx-1"></i>{" "}
                        {isFormSubmitting ? "Guardando..." : "Registrar movimiento"}
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
