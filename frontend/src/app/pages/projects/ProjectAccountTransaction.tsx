import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button, Table } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { Movements } from "./interfaces";
import { DateFormatter } from "../../helpers/date.formatter";
import { NumberFormatter } from "../../helpers";

interface CurrencyInterface {
  name: string;
  symbol: string;
  is_monetary: boolean;
}

interface ProjectInterface {
  id: string;
  title: string;
  client: string;
  locality: string;
}

interface AccountInterface {
  id: string;
  project: ProjectInterface;
  currency: CurrencyInterface;
}

interface ProjectTransactionDetailEntityInterface {
  id: string;
  account: AccountInterface;
  type:
    | "NEW_PAYMENT"
    | "POS_ADJ"
    | "NEG_ADJ"
    | "NEW_SUPPLIER_PAYMENT"
    | "DEL_SUPPLIER_PAYMENT";
  description: string;
  received_amount: number;
  received_currency: CurrencyInterface;
  prev_balance: number;
  equivalent_amount: number;
  post_balance: number;
  user: string;
  createdAt: Date;
}

export const ProjectAccountTransaction = () => {
  const { id_transaction } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] =
    useState<ProjectTransactionDetailEntityInterface>();
  const [exchangeRate, setExchangeRate] = useState<number>(0);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(
        `/project_account_transactions/${id_transaction}`
      );
      setTransaction(data.item);
      setLoading(false);
      const rate = Math.round(
        data.item.received_amount / data.item.equivalent_amount
      );
      setExchangeRate(rate);
    } catch (error) {
      return navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, [id_transaction]);

  return (
    <div>
      {loading && <LoadingSpinner />}
      {!loading && transaction && (
        <>
          <div className="d-flex gap-3 align-items-center mb-3 justify-content-between">
            <div className="d-flex gap-3 align-items-center">
              <Button
                variant="light border text-muted"
                size="sm"
                onClick={() =>
                  navigate(
                    `/proyectos/${transaction.account.project.id}/cuentas/${transaction.account.id}`
                  )
                }
                title="Volver al listado de movimientos"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Atrás
              </Button>
              <h1 className="fs-5 my-0">Detalle de movimiento</h1>
            </div>
            <div>
              <Button variant="danger" size="sm">
                <i className="bi bi-file-pdf me-2"></i>
                Descargar en PDF
              </Button>
            </div>
          </div>
          <hr />
          <Row className="mx-0">
            <Col xs={12} lg={2}></Col>
            <Col xs={12} lg={8} className="shadow-sm border rounded-2 p-2">
              <div className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="fs-5">Comprobante de movimiento</h2>
                  <span className="font-monospace small">
                    ID_MOVIMIENTO: {id_transaction}
                  </span>
                </div>
                <hr className="my-2" />
                <h3 className="fs-6 text-muted">Datos de la cuenta</h3>
                <Row>
                  <Col xs={12} md={6}>
                    <span className="small">
                      Cliente: {transaction.account.project.client}
                    </span>
                  </Col>
                  <Col xs={12} md={6}>
                    <span className="small">
                      Moneda: {transaction.account.currency.name} (
                      {transaction.account.currency.symbol})
                    </span>
                  </Col>
                </Row>
                <h3 className="fs-6 text-muted mt-3">Datos del proyecto</h3>
                <Row>
                  <Col xs={12} md={6}>
                    <span className="small">
                      Proyecto:{" "}
                      {transaction.account.project.title || "Sin título"}
                    </span>
                  </Col>
                  <Col xs={12} md={6}>
                    <span className="small">
                      Localidad proyecto: {transaction.account.project.locality}
                    </span>
                  </Col>
                </Row>
                <hr />
                <h3 className="fs-6 text-muted mt-3">Detalle del movimiento</h3>
                <span className="small">
                  Tipo de movimiento: {Movements[transaction.type]}
                </span>
                <br />
                <span className="small">
                  Descripción: {transaction.description}
                </span>
                <br />
                <span className="small">
                  Moneda movimiento: {transaction.received_currency.name} (
                  {transaction.received_currency.symbol})
                </span>
                <br />
                <Table
                  striped
                  bordered
                  hover
                  size="sm"
                  className="mt-3 small text-uppercase text-center"
                >
                  <thead>
                    <tr>
                      <th className="col-3">Importe</th>
                      <th className="col-3">Saldo anterior</th>
                      <th className="col-3">
                        Importe real ({transaction.account.currency.symbol})
                      </th>
                      <th className="col-3">Saldo posterior</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {`${
                          transaction.received_currency.symbol
                        } ${NumberFormatter.formatNotsignedCurrency(
                          transaction.received_currency.is_monetary,
                          transaction.received_amount
                        )}`}
                      </td>
                      <td>
                        {`${
                          transaction.account.currency.symbol
                        } ${NumberFormatter.formatSignedCurrency(
                          transaction.account.currency.is_monetary,
                          transaction.prev_balance
                        )}`}
                      </td>
                      <td className="fw-bold">
                        {`${
                          transaction.account.currency.symbol
                        } ${NumberFormatter.formatSignedCurrency(
                          transaction.account.currency.is_monetary,
                          transaction.equivalent_amount
                        )}`}
                      </td>
                      <td>
                        {`${
                          transaction.account.currency.symbol
                        } ${NumberFormatter.formatSignedCurrency(
                          transaction.account.currency.is_monetary,
                          transaction.post_balance
                        )}`}
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <p className="small fst-italic text-muted">
                  Tipo de cambio aplicado:
                  {` 1 ${
                    transaction.account.currency.name
                  } = ${NumberFormatter.toDecimal(exchangeRate)} ${
                    transaction.received_currency.name
                  }`}
                </p>
                <Row>
                  <Col xs={12} md={6}>
                    <span className="small">
                      Fecha registro:{" "}
                      {DateFormatter.toDMYH(transaction.createdAt)}
                    </span>
                  </Col>
                  <Col xs={12} md={6}>
                    <span className="small">
                      Usuario responsable: {transaction.user}
                    </span>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={12} lg={2}></Col>
          </Row>
        </>
      )}
    </div>
  );
};
