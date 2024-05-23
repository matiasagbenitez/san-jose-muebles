import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, PageHeader } from "../../components";
import { NumberFormatter, DateFormatter } from "../../helpers";
import { SupplierTransactionDetailInterface, Movements } from "./interfaces";

export const SupplierAccountTransaction = () => {
  const { id: id_supplier, id_supplier_account, id_transaction } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] =
    useState<SupplierTransactionDetailInterface>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(
        `/supplier_account_transactions/${id_supplier}/${id_supplier_account}/${id_transaction}`
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
            goBackTo={`/proveedores/${id_supplier}/cuentas/${id_supplier_account}`}
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
                  Entidad
                </th>
                <td className="col-4 px-2 fw-bold">
                  {transaction.supplier.name}
                </td>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  Localidad
                </th>
                <td className="col-4 px-2">{transaction.supplier.locality}</td>
              </tr>
              <tr>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  Tipo de movimiento
                </th>
                <td className="col-4 px-2">{Movements[transaction.type]}</td>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  Moneda
                </th>
                <td className="col-4 px-2">
                  {transaction.currency.name} ({transaction.currency.symbol})
                </td>
              </tr>
              <tr>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  Descripción
                </th>
                <td className="col-10 px-2" colSpan={3}>
                  {transaction.description}
                </td>
              </tr>
              <tr>
                <th
                  className="col-2 px-2"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  Importe movimiento
                </th>
                <td className="col-10 px-2 fw-bold" colSpan={3}>
                  {`${
                    transaction.currency.symbol
                  } ${NumberFormatter.formatSignedCurrency(
                    transaction.currency.is_monetary,
                    transaction.amount
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
                <th style={{ backgroundColor: "#F2F2F2" }} className="col-4">
                  Saldo anterior
                </th>
                <th style={{ backgroundColor: "#F2F2F2" }} className="col-4">
                  Importe movimiento
                </th>
                <th style={{ backgroundColor: "#F2F2F2" }} className="col-4">
                  Saldo posterior
                </th>
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
                <td
                  className={`fw-bold text-${
                    transaction.amount < 0 ? "danger" : "success"
                  }`}
                >
                  {transaction.currency.symbol}{" "}
                  {NumberFormatter.formatSignedCurrency(
                    transaction.currency.is_monetary,
                    transaction.amount
                  )}
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
