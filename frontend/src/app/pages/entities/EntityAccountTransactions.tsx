import React, { useState, useEffect, useReducer, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Modal,
  Form as FormRB,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";

import { LoadingSpinner, PageHeader } from "../../components";
import { DateFormatter, NumberFormatter } from "../../helpers";
import { SweetAlert2 } from "../../utils";
import apiSJM from "../../../api/apiSJM";

import { NumericFormat } from "react-number-format";
import { TableColumn } from "react-data-table-component";
import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
  ColumnOmitter,
  ColumnsHiddenInterface,
} from "../../shared";

import { MovementType, types, AccountInterface } from "./interfaces";

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

  const [omittedColumns, setOmittedColumns] =
    useState<ColumnsHiddenInterface>(columnsHidden);

  const [formData, setFormData] = useState(initialForm);

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
    setFormData(initialForm);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsFormSubmitting(true);
      const confirmation = await SweetAlert2.confirm(
        "¿Está seguro de registrar el movimiento?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post(
        "/entity_account_transactions/new-movement",
        { ...formData, id_entity_account: id_entity_account }
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

  const handleRedirect = (row: DataRow) => {
    navigate(
      `/entidades/${id_entity}/cuentas/${id_entity_account}/movimientos/${row.id}`
    );
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

          <Modal show={isModalOpen} onHide={() => handleClose()}>
            <div className="p-3">
              <h5>Nuevo movimiento</h5>
              <hr />

              <FormRB onSubmit={handleSubmit}>
                {/* TIPO DE MOVIMIENTO */}
                <InputGroup size="sm">
                  <InputGroup.Text>Tipo de movimiento</InputGroup.Text>
                  <FormRB.Select
                    required
                    name="type"
                    onChange={(e: any) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    disabled={isFormSubmitting}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="PAYMENT">Pago / Abono</option>
                    <option value="DEBT">Deuda / Cargo</option>
                    <option value="POS_ADJ">
                      Ajuste a favor (disminuye deuda)
                    </option>
                    <option value="NEG_ADJ">
                      Ajuste en contra (aumenta deuda)
                    </option>
                  </FormRB.Select>
                </InputGroup>
                {/* DESCRIPCIÓN */}
                <InputGroup className="mt-2 mb-3" size="sm">
                  <InputGroup.Text>Descripción</InputGroup.Text>
                  <FormRB.Control
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
                    min={1}
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
              </FormRB>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};
