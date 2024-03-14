import { Table, Row, Col, Badge } from "react-bootstrap";
import { PurchaseInfoProps } from "../interfaces";
import { toMoney } from "../../../../helpers";

export const InfoPurchase = ({
  currency,
  is_monetary,
  subtotal,
  discount,
  other_charges,
  total,
  paid_amount,
  credit_balance,
  payed_off,
  fully_stocked,
  nullified,
}: PurchaseInfoProps) => {
  return (
    <>
      <Row>
        <Col lg={6}>
          <Table size="sm" className="small" striped bordered responsive>
            <tbody>
              <tr className="text-center fw-bold">
                <th colSpan={12}>Resumen de la compra</th>
              </tr>
              <tr>
                <th scope="row">Moneda de compra</th>
                <td className="text-end">{currency}</td>
              </tr>
              <tr>
                <th scope="row">Subtotal productos</th>
                <td className="text-end">
                  {is_monetary && "$"}
                  {toMoney(subtotal)}
                </td>
              </tr>
              <tr>
                <th scope="row">Descuento</th>
                <td className="text-end">
                  {is_monetary && "$"}
                  {toMoney(discount)}
                </td>
              </tr>
              <tr>
                <th scope="row">Otros cargos</th>
                <td className="text-end">
                  {is_monetary && "$"}
                  {toMoney(other_charges)}
                </td>
              </tr>
              <tr className="text-uppercase fw-bold">
                <th scope="row">Total a pagar</th>
                <td className="text-end">
                  {is_monetary && "$"}
                  {toMoney(total)}
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col lg={6}>
          <Table size="sm" className="small" striped bordered responsive>
            <tbody>
              <tr className="text-center fw-bold">
                <th colSpan={12}>Estado de la compra</th>
              </tr>
              <tr>
                <th scope="row">Validez compra</th>
                <td className="text-end text-uppercase">
                  {nullified ? <Badge bg="danger">Anulada</Badge> : <Badge bg="success">Válida</Badge>} 
                </td>
              </tr>
              <tr>
                <th scope="row">Monto pagado</th>
                <td className="text-end">
                  {is_monetary && "$"}
                  {toMoney(paid_amount)}
                </td>
              </tr>
              <tr>
                <th scope="row">Saldo pendiente</th>
                <td className="text-end">
                  {is_monetary && "$"}
                  {toMoney(credit_balance)}
                </td>
              </tr>
              <tr>
                <th scope="row">Compra saldada</th>
                <td className="text-end text-uppercase">
                  {payed_off ? <Badge bg="success">Sí</Badge> : <Badge bg="warning">No</Badge>}
                </td>
              </tr>
              <tr>
                <th scope="row">Stock completo</th>
                <td className="text-end text-uppercase">
                  {fully_stocked ? <Badge bg="success">Sí</Badge> : <Badge bg="warning">No</Badge>}
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};
