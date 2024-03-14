import { Table } from "react-bootstrap";
import { DetailInterface } from "../interfaces";
import { toMoney } from "../../../../helpers";

export const PurchaseItems = ({ detail }: { detail: DetailInterface }) => {
  const { items, is_monetary } = detail;

  return (
    <>
      <Table size="sm" className="small" striped bordered responsive>
        <thead className="text-center fw-bold text-uppercase">
          <tr>
            <th colSpan={6}>Productos</th>
            <th colSpan={3}>Stock</th>
          </tr>
          <tr>
            <th className="px-4">Cant.</th>
            <th className="px-4">Unidad</th>
            <th className="px-4">Marca</th>
            <th className="col-5">Nombre</th>
            <th className="col-2">Precio </th>
            <th className="col-2">Subtotal</th>
            <th className="col-1">Recibido</th>
            <th className="col-1">Pendiente</th>
            <th className="col-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="text-center">{item.quantity}</td>
              <td className="text-center">{item.unit}</td>
              <td>{item.brand}</td>
              <td>{item.product}</td>
              <td className="text-end">
                {is_monetary && "$"}
                {toMoney(item.price)}
              </td>
              <td className="text-end">
                {is_monetary && "$"}
                {toMoney(item.subtotal)}
              </td>
              <td className="text-center">
                <div className="d-flex gap-1 justify-content-center">
                  {item.actual_stocked} / {item.quantity}
                </div>
              </td>
              <td className="text-center">
                {!item.fully_stocked && <>{item.quantity}</>}
              </td>
              <td className="text-center">...</td>
            </tr>
          ))}
          <tr>
            <td colSpan={5} className="text-end fw-bold text-uppercase">
              Subtotal
            </td>
            <td className="text-end fst-italic">
              {is_monetary && "$"}
              {toMoney(detail.subtotal)}
            </td>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <td colSpan={5} className="text-end fw-bold text-uppercase">
              Descuento
            </td>
            <td className="text-end fst-italic">
              {" - "}
              {is_monetary && "$"}
              {toMoney(detail.discount)}
            </td>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <td colSpan={5} className="text-end fw-bold text-uppercase">
              Otros cargos
            </td>
            <td className="text-end fst-italic">
              {is_monetary && "$"}
              {toMoney(detail.other_charges)}
            </td>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <td colSpan={5} className="text-end fw-bold text-uppercase">
              Total compra
            </td>
            <td className="text-end fw-bold">
              {is_monetary && "$"}
              {toMoney(detail.total)}
            </td>
            <td colSpan={3} className="fw-bold text-uppercase">
              {detail.currency}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
