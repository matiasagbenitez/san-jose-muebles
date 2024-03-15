import { Table, Badge, Alert } from "react-bootstrap";
import { ResumeInterface, NullifiedInterface } from "../interfaces";
import { DayJsAdapter, toMoney } from "../../../../helpers";

export const PurchaseData = ({
  isNullified,
  data,
  nullifiedData,
}: {
  isNullified: boolean;
  data: ResumeInterface;
  nullifiedData: NullifiedInterface;
}) => {
  const {
    date,
    supplier,
    currency,
    is_monetary,
    total,
    paid_amount,
    credit_balance,
    payed_off,
    created_at,
    created_by,
  } = data;

  const { nullifier, nullified_date, nullified_reason } = nullifiedData;

  return (
    <>
      {isNullified && (
        <Alert variant="danger" className="small">
          <Alert.Heading className="fs-6">
            <i className="bi bi-exclamation-triangle"></i> Compra anulada el{" "}
            {DayJsAdapter.toDayMonthYearHour(nullified_date)} ({nullifier})
          </Alert.Heading>
          <hr className="my-2" />
          <p className="mb-0">
            <u>Motivo:</u> {nullified_reason || "No especificado"}
          </p>
        </Alert>
      )}

      <Table size="sm" className="small" striped bordered responsive>
        <tbody>
          <tr className="text-center fw-bold text-uppercase">
            <th colSpan={2}>Resumen de la compra</th>
          </tr>
          <tr>
            <th scope="row">Validez</th>
            <td className="text-end text-uppercase">
              {" "}
              {isNullified ? (
                <Badge bg="danger">Compra anulada</Badge>
              ) : (
                <Badge bg="success">Compra válida</Badge>
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Fecha compra</th>
            <td className="text-end">{DayJsAdapter.toDayMonthYear(date)}</td>
          </tr>
          <tr>
            <th scope="row">Proveedor</th>
            <td className="text-end">
              {supplier.name} ({supplier.locality})
            </td>
          </tr>
          <tr>
            <th scope="row">Moneda compra</th>
            <td className="text-end">{currency}</td>
          </tr>
          <tr>
            <th scope="row">Importe compra</th>
            <td className="text-end">
              {is_monetary && "$"}
              {toMoney(total)}
            </td>
          </tr>
          <tr>
            <th scope="row">Importe pagado</th>
            <td className="text-end">
              {is_monetary && "$"}
              {toMoney(paid_amount)}
            </td>
          </tr>
          <tr>
            <th scope="row">Saldo pendiente</th>
            <td className="text-end">
              {payed_off ? (
                <i
                  className="bi bi-check-circle-fill text-success me-2"
                  title="No registra saldo pendiente"
                ></i>
              ) : (
                <i
                  className="bi bi-exclamation-triangle-fill text-warning me-2"
                  title="Saldo pendiente"
                ></i>
              )}

              {is_monetary && "$"}
              {toMoney(credit_balance)}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <small className="text-muted">
                Compra registrada el{" "}
                {DayJsAdapter.toDayMonthYearHour(created_at)} por {created_by}
              </small>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
