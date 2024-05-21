import React, { useState, useEffect, useReducer } from "react";
import {
  Button,
  Modal,
  Form as FormRB,
  InputGroup,
  Row,
  Col,
  Table,
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
import { MovementType, types } from "./interfaces";

interface AccountInterface {
  id: number;
  entity: string;
  locality: string;
  currency: {
    name: string;
    symbol: string;
    is_monetary: boolean;
  };
  balance: number;
}

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
}

export const EntityAccountTransactions = () => {
  const { id: id_entity, id_entity_account } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = `/entity_account_transactions/${id_entity_account}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<AccountInterface | null>(null);

  const [formData, setFormData] = useState(initialForm);

  const fetch = async () => {
    try {
      const [_, res2] = await Promise.all([
        fetchData(endpoint, 1, state, dispatch),
        apiSJM.get(
          `/entity_accounts/entity/${id_entity}/account/${id_entity_account}`
        ),
      ]);
      setAccount(res2.data.account);
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

  const columns: TableColumn<DataRow>[] = [
    {
      name: "ID",
      selector: (row: DataRow) => row.id,
      width: "80px",
      center: true,
    },
    {
      name: "FECHA REGISTRO",
      selector: (row: any) => DateFormatter.toDMYH(row.createdAt),
      maxWidth: "140px",
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
      wrap: true,
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
      selector: (row: DataRow) => row.prev_balance,
      format: (row: DataRow) => (
        <>
          {NumberFormatter.formatSignedCurrency(
            account?.currency.is_monetary,
            row.prev_balance
          )}
        </>
      ),
      maxWidth: "145px",
      right: true,
    },
    {
      name: "MONTO MOVIMIENTO",
      maxWidth: "145px",
      selector: (row: DataRow) => row.amount,
      format: (row: DataRow) => (
        <>
          {NumberFormatter.formatSignedCurrency(
            account?.currency.is_monetary,
            row.amount
          )}
        </>
      ),
      right: true,
      style: { fontWeight: "bold", background: "#f0f0f0", fontSize: "1.1em" },
    },
    {
      name: "SALDO POSTERIOR",
      maxWidth: "145px",
      selector: (row: DataRow) => row.post_balance,
      format: (row: DataRow) => (
        <>
          {NumberFormatter.formatSignedCurrency(
            account?.currency.is_monetary,
            row.post_balance
          )}
        </>
      ),
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
        "/entity_account_transactions/new-movement",
        { ...formData, id_entity_account: id_entity_account }
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

  const handleRedirect = (row: DataRow) => {
    console.log(row);
    // navigate(`/cuentas-proveedores/${id_entity_account}/movimiento/${row.id}`);
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

            <Col xs={12} xl={5}>
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
