import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, PageHeader } from "../../components";
import { Movements } from "./interfaces";
import { NumberFormatter, DateFormatter } from "../../helpers";

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
  const { id: id_project, id_project_account, id_transaction } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] =
    useState<ProjectTransactionDetailEntityInterface>();
  const [exchangeRate, setExchangeRate] = useState<number>(0);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(
        `/project_account_transactions/${id_project}/${id_project_account}/${id_transaction}`
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

  const handleExportPDF = () => {
    console.log("Exportar PDF");
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      {!loading && transaction && (
        <>
          <PageHeader
            goBackTo={`/proyectos/${transaction.account.project.id}/cuentas/${transaction.account.id}`}
            goBackTitle="Volver al listado de movimientos"
            title="Detalle de movimiento"
            handleAction={handleExportPDF}
            actionButtonText="Descargar en PDF"
            actionButtonVariant="danger"
            actionButtonIcon="bi-file-earmark-pdf"
          />

          <h5 className="text-muted">
            Detalle de movimiento {Movements[transaction.type]}{" "}
          </h5>

          <Table
            responsive
            bordered
            size="sm"
            className="mt-2 small text-uppercase align-middle"
          >
            <tbody>
              <tr>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  ID Movimiento
                </th>
                <td className="col-4 px-2">{transaction.id}</td>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  Fecha de registro
                </th>
                <td className="col-4 px-2">
                  {DateFormatter.toDMYH(transaction.createdAt)}
                </td>
              </tr>
              <tr>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  Cliente
                </th>
                <td className="col-4 px-2 fw-bold">
                  {transaction.account.project.client}
                </td>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  Proyecto
                </th>
                <td className="col-4 px-2">
                  {transaction.account.project.title} (
                  {transaction.account.project.locality})
                </td>
              </tr>
              <tr>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  Tipo de movimiento
                </th>
                <td className="col-4 px-2">{Movements[transaction.type]}</td>
              </tr>
              <tr>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  Moneda movimiento
                </th>
                <td className="col-4 px-2">
                  {transaction.received_currency.name} (
                  {transaction.received_currency.symbol})
                </td>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  Moneda cuenta
                </th>
                <td className="col-4 px-2">
                  {transaction.account.currency.name} (
                  {transaction.account.currency.symbol})
                </td>
              </tr>
              <tr>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  Importe movimiento
                </th>
                <td className="col-4 px-2">
                  {`${
                    transaction.received_currency.symbol
                  } ${NumberFormatter.formatSignedCurrency(
                    transaction.received_currency.is_monetary,
                    transaction.received_amount
                  )}`}
                </td>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  Importe en cuenta
                </th>
                <td className="col-4 px-2">
                  {`${
                    transaction.account.currency.symbol
                  } ${NumberFormatter.formatSignedCurrency(
                    transaction.account.currency.is_monetary,
                    transaction.equivalent_amount
                  )}`}
                </td>
              </tr>
            </tbody>
          </Table>

          <h6>Resumen del movimiento</h6>

          <Table
            responsive
            bordered
            size="sm"
            className="small text-uppercase text-center align-middle"
          >
            <thead>
              <tr>
                <th style={{ backgroundColor: "#F2F2F2" }} className="col-3">
                  Importe movimiento
                </th>
                <th style={{ backgroundColor: "#F2F2F2" }} className="col-3">
                  Saldo anterior
                </th>
                <th style={{ backgroundColor: "#F2F2F2" }} className="col-3">
                  Importe en cuenta ({transaction.account.currency.symbol})
                </th>
                <th style={{ backgroundColor: "#F2F2F2" }} className="col-3">
                  Saldo posterior
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className={`fw-bold text-${
                    transaction.received_amount < 0 ? "danger" : "success"
                  }`}
                >
                  {`${
                    transaction.received_currency.symbol
                  } ${NumberFormatter.formatSignedCurrency(
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
                <td
                  className={`fw-bold text-${
                    transaction.equivalent_amount < 0 ? "danger" : "success"
                  }`}
                >
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
            Tipo de cambio aplicado al momento de la transacción:
            {` 1 ${
              transaction.account.currency.name
            } = ${NumberFormatter.toDecimal(exchangeRate)} ${
              transaction.received_currency.name
            }`}
          </p>

          <p className="small text-muted">
            <i className="bi bi-clock me-2"></i>
            Transacción registrada el{" "}
            {DateFormatter.toDMYH(transaction.createdAt)} por {transaction.user}
            .
          </p>

        </>
      )}
    </div>
  );
};
