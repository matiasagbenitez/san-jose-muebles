import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Table, Button } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, PageHeader } from "../../components";
import { Movements } from "./interfaces";
import { DateFormatter } from "../../helpers/date.formatter";
import { NumberFormatter } from "../../helpers";
import { SweetAlert2 } from "../../utils";

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
  type: "NEW_PAYMENT" | "POS_ADJ" | "NEG_ADJ" | "NEW_SUPPLIER_PAYMENT";
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
          <PageHeader
            goBackTo={`/proyectos/${transaction.account.project.id}/cuentas/${transaction.account.id}`}
            goBackTitle="Volver al listado de movimientos"
            title="Detalle de movimiento"
            actionButtonText="Descargar en PDF"
            actionButtonVariant="danger"
            actionButtonIcon="bi-file-earmark-pdf"
          />

          <Row className="mx-0">
            <Col xs={12} lg={2}></Col>
            <Col xs={12} lg={8} className="shadow-sm border rounded-2 p-4">
              <Row className="px-3">
                <Col xs={12} md={6}>
                  <h2 className="fs-5 text-uppercase">
                    Comprobante de pago de cliente
                  </h2>
                </Col>
              </Row>
              <div className="px-3">
                <hr className="my-2" />
                <h3 className="fs-6 text-muted">Información del cliente</h3>
                <Row>
                  <Col xs={12} md={6}>
                    <span className="small">
                      <b>Cliente:</b> {transaction.account.project.client}
                    </span>
                  </Col>
                  <Col xs={12} md={6}>
                    <span className="small">
                      <b>Proyecto:</b>{" "}
                      {transaction.account.project.title || "Sin título"} (
                      {transaction.account.project.locality})
                    </span>
                  </Col>
                </Row>
                <h3 className="fs-6 text-muted mt-3">
                  Información del movimiento
                </h3>
                <Row>
                  <Col xs={12} md={6}>
                    <span className="small">
                      <b> Moneda cuenta:</b> {transaction.account.currency.name}{" "}
                      ({transaction.account.currency.symbol})
                    </span>
                  </Col>
                  <Col xs={12} md={6}>
                    <span className="small">
                      <b>Moneda movimiento:</b>{" "}
                      {transaction.received_currency.name} (
                      {transaction.received_currency.symbol})
                    </span>
                  </Col>
                  <Col xs={12}>
                    <span className="small">
                      <b>Tipo de movimiento:</b> {Movements[transaction.type]}
                    </span>
                  </Col>
                  <Col xs={12}>
                    <span className="small">
                      <b>Descripción:</b> {transaction.description}
                    </span>
                  </Col>
                </Row>

                <Table
                  striped
                  bordered
                  hover
                  size="sm"
                  className="mt-3 small text-uppercase text-center"
                >
                  <thead>
                    <tr>
                      <th className="col-3">Importe movimiento</th>
                      <th className="col-3">Saldo anterior</th>
                      <th className="col-3">
                        Importe en cuenta ({transaction.account.currency.symbol}
                        )
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
                <span className="small fst-italic">
                  ID #{id_transaction} - Fecha:{" "}
                  {DateFormatter.toDMYH(transaction.createdAt)} (
                  {transaction.user})
                </span>
              </div>
            </Col>
            <Col xs={12} lg={2}></Col>
          </Row>
        </>
      )}
    </div>
  );
};
