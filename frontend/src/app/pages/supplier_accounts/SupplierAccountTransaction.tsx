import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, PageHeader } from "../../components";
import { DateFormatter } from "../../helpers/date.formatter";
import { NumberFormatter } from "../../helpers";

enum Movements {
  NEW_PAYMENT = "PAGO PROPIO",
  POS_ADJ = "AJUSTE A FAVOR",
  NEG_ADJ = "AJUSTE EN CONTRA",
  NEW_CLIENT_PAYMENT = "PAGO DE CLIENTE A PROVEEDOR",
  DEL_CLIENT_PAYMENT = "ANULACIÓN PAGO DE A PROVEEDOR",
}

interface CurrencyInterface {
  name: string;
  symbol: string;
  is_monetary: boolean;
}

interface SupplierInterface {
  id: string;
  name: string;
  locality: string;
}

interface SupplierTransactionDetailEntityInterface {
  id: string;
  id_account: string;
  supplier: SupplierInterface;
  currency: CurrencyInterface;
  type:
    | "NEW_PAYMENT"
    | "POS_ADJ"
    | "NEG_ADJ"
    | "NEW_CLIENT_PAYMENT"
    | "DEL_CLIENT_PAYMENT";
  description: string;
  prev_balance: number;
  amount: number;
  post_balance: number;
  user: string;
  createdAt: Date;
}

export const SupplierAccountTransaction = () => {
  const { id_transaction } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] =
    useState<SupplierTransactionDetailEntityInterface>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(
        `/supplier_account_transactions/${id_transaction}`
      );
      setTransaction(data.item);
      setLoading(false);
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
            goBackTo={`/cuentas-proveedores/${transaction.id_account}`}
            goBackTitle="Volver al listado de movimientos"
            title="Detalle de movimiento"
            handleAction={handleExportPDF}
            actionButtonText="Descargar en PDF"
            actionButtonVariant="danger"
            actionButtonIcon="bi-file-earmark-pdf"
          />

          <Row className="mx-0">
            <Col xs={12} lg={2}></Col>
            <Col xs={12} lg={8} className="shadow-sm border rounded-2 p-3">
              <Row className="px-3">
                <Col xs={12} md={6}>
                  <h2 className="fs-5">Comprobante de movimiento</h2>
                </Col>
                <Col xs={12} md={6} className="text-md-end">
                  <span className="font-monospace small">
                    ID_MOVIMIENTO: {id_transaction}
                  </span>
                </Col>
              </Row>
              <div className="px-3">
                <hr className="my-2" />
                <h3 className="fs-6 text-muted">Información del proveedor</h3>
                <Row>
                  <Col xs={12} md={6}>
                    <span className="small">
                      <b>Proveedor:</b> {transaction.supplier.name}
                    </span>
                  </Col>
                  <Col xs={12} md={6}>
                    <span className="small">
                      <b>Localidad:</b> {transaction.supplier.locality}
                    </span>
                  </Col>
                </Row>
                <h3 className="fs-6 text-muted mt-3">
                  Información del movimiento
                </h3>
                <Row>
                  <Col xs={12} md={6}>
                    <span className="small">
                      <b> Moneda cuenta:</b> {transaction.currency.name} (
                      {transaction.currency.symbol})
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
                      <th className="col-4">Saldo anterior</th>
                      <th className="col-4">Importe movimiento</th>
                      <th className="col-4">Saldo posterior</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {`${
                          transaction.currency.symbol
                        } ${NumberFormatter.formatSignedCurrency(
                          transaction.currency.is_monetary,
                          transaction.prev_balance
                        )}`}
                      </td>
                      <td className="fw-bold">
                        {`${
                          transaction.currency.symbol
                        } ${NumberFormatter.formatSignedCurrency(
                          transaction.currency.is_monetary,
                          transaction.amount
                        )}`}
                      </td>
                      <td>
                        {`${
                          transaction.currency.symbol
                        } ${NumberFormatter.formatSignedCurrency(
                          transaction.currency.is_monetary,
                          transaction.post_balance
                        )}`}
                      </td>
                    </tr>
                  </tbody>
                </Table>

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
