import { useState } from "react";
import { Dropdown, Table } from "react-bootstrap";
import { ItemInterface } from "../../interfaces";
import { toMoney } from "../../../../../helpers";
import { UpdateItemStockForm } from "..";

const initialItem: ItemInterface = {
  id: 0,
  quantity: 0,
  unit: "",
  brand: "",
  product: "",
  price: 0,
  subtotal: 0,
  actual_stocked: 0,
  fully_stocked: false,
};

export const PurchaseItems = ({
  status,
  items,
  totals,
  updateItemStock,
  showModal,
  setShowModal,
}: {
  status: 'VALIDA' | 'ANULADA';
  items: ItemInterface[];
  totals: any;
  updateItemStock: any;
  showModal: boolean;
  setShowModal: any;
}) => {
  const { is_monetary } = totals;
  const [selectedItem, setSelectedItem] = useState<ItemInterface>(initialItem);

  const openModal = (item: ItemInterface) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedItem(initialItem);
    setShowModal(false);
  };

  return (
    <>
      <Table size="sm" className="small" striped bordered responsive>
        <thead className="text-center fw-bold text-uppercase">
          <tr>
            <th colSpan={5}>Productos</th>
            <th colSpan={3}>Stock</th>
          </tr>
          <tr>
            <th className="col-1">Cantidad</th>
            <th className="col-1">Marca</th>
            <th className="col-5">Nombre</th>
            <th className="col-1">Precio </th>
            <th className="col-1">Subtotal</th>
            <th className="col-1">Recibido</th>
            <th className="col-1">Pendiente</th>
            <th className="col-1">Actualizar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="text-center px-2">
                {item.quantity} {item.unit}
              </td>
              <td className="text-center px-2">{item.brand}</td>
              <td className="px-2">{item.product}</td>
              <td className="text-end px-2">
                {is_monetary && "$"}
                {toMoney(item.price)}
              </td>
              <td className="text-end px-2">
                {is_monetary && "$"}
                {toMoney(item.subtotal)}
              </td>
              <td className="text-center px-2">
                {/* RECIBIDO */}
                {item.actual_stocked} / {item.quantity} {item.unit}
              </td>
              <td className="text-center px-2">
                {/* PENDIENTE */}
                {!item.fully_stocked && (
                  <>
                    {item.quantity - item.actual_stocked} {item.unit}
                  </>
                )}
              </td>
              <td className="text-center px-2">
                {/* ACTUALIZAR */}
                {!item.fully_stocked && status === "VALIDA" && (
                  <Dropdown>
                    <Dropdown.Toggle
                      size="sm"
                      variant="success"
                      className="small py-0 px-2"
                    ></Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        className="small"
                        disabled={item.fully_stocked}
                        onClick={() => openModal(item)}
                      >
                        Recepción parcial
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="small"
                        disabled={item.fully_stocked}
                        onClick={(e) =>
                          updateItemStock(
                            e,
                            item.id,
                            item.product,
                            item.quantity - item.actual_stocked
                          )
                        }
                      >
                        Recepción total
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} className="text-end fst-italic text-uppercase px-2">
              Subtotal
            </td>
            <td className="text-end fst-italic px-2">
              {is_monetary && "$"}
              {toMoney(totals.subtotal)}
            </td>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <td colSpan={4} className="text-end fst-italic text-uppercase px-2">
              Descuento
            </td>
            <td className="text-end fst-italic px-2">
              {" - "}
              {is_monetary && "$"}
              {toMoney(totals.discount)}
            </td>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <td colSpan={4} className="text-end fst-italic text-uppercase px-2">
              Otros cargos
            </td>
            <td className="text-end fst-italic px-2">
              {is_monetary && "$"}
              {toMoney(totals.other_charges)}
            </td>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <td colSpan={4} className="text-end fw-bold text-uppercase px-2">
              Total compra
            </td>
            <td className="text-end fw-bold px-2">
              {is_monetary && "$"}
              {toMoney(totals.total)}
            </td>
            <td colSpan={3} className="fw-bold text-uppercase px-2">
              {totals.currency}
            </td>
          </tr>
        </tbody>
      </Table>

      <UpdateItemStockForm
        selectedItem={selectedItem}
        updateItemStock={updateItemStock}
        showModal={showModal}
        setShowModal={setShowModal}
        closeModal={closeModal}
      />
    </>
  );
};
