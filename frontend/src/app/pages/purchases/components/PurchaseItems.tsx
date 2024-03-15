import { useState } from "react";
import { Dropdown, Table, Modal } from "react-bootstrap";
import { ItemInterface } from "../interfaces";
import { toMoney } from "../../../../helpers";
import { SweetAlert2 } from "../../../utils";
import apiSJM from "../../../../api/apiSJM";

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
  id,
  isNullified,
  items,
  totals,
  updateItemFullStock,
  showModal,
  setShowModal,
}: {
  id: number;
  isNullified: boolean;
  items: ItemInterface[];
  totals: any;
  updateItemFullStock: any;
  showModal: boolean;
  setShowModal: any;
}) => {
  const { is_monetary } = totals;
  const [selectedItem, setSelectedItem] = useState<ItemInterface>(initialItem);
  const [quantity, setQuantity] = useState<number>(0);

  const openModal = (item: ItemInterface) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedItem(initialItem);
    setQuantity(0);
    setShowModal(false);
  };

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
            <th className="col-1">Actualizar</th>
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
                {!item.fully_stocked && (
                  <>{item.quantity - item.actual_stocked}</>
                )}
              </td>
              <td className="text-center">
                {!item.fully_stocked && !isNullified && (
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
                          updateItemFullStock(e, item.id, item.quantity)
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
            <td colSpan={5} className="text-end fw-bold text-uppercase">
              Subtotal
            </td>
            <td className="text-end fst-italic">
              {is_monetary && "$"}
              {toMoney(totals.subtotal)}
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
              {toMoney(totals.discount)}
            </td>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <td colSpan={5} className="text-end fw-bold text-uppercase">
              Otros cargos
            </td>
            <td className="text-end fst-italic">
              {is_monetary && "$"}
              {toMoney(totals.other_charges)}
            </td>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <td colSpan={5} className="text-end fw-bold text-uppercase">
              Total compra
            </td>
            <td className="text-end fw-bold">
              {is_monetary && "$"}
              {toMoney(totals.total)}
            </td>
            <td colSpan={3} className="fw-bold text-uppercase">
              {totals.currency}
            </td>
          </tr>
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Recepción parcial</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small">
          <p className="mb-2">
            <strong>Producto:</strong> {selectedItem.product}
          </p>
          <p className="mb-2">
            <strong>Cantidad comprada:</strong> {selectedItem.quantity}{" "}
            {selectedItem.unit}
          </p>
          <p className="mb-2">
            <strong>Stock recibido:</strong> {selectedItem.actual_stocked}
          </p>
          <p className="mb-2">
            <strong>Stock pendiente:</strong>{" "}
            {selectedItem.quantity - selectedItem.actual_stocked}
          </p>
          <form
            onSubmit={(e) => updateItemFullStock(e, selectedItem.id, quantity)}
          >
            <label htmlFor="quantity" className="fw-bold mb-1">
              Cantidad a recibir
            </label>
            <div className="d-flex align-items-center">
              <input
                id="quantity"
                type="number"
                className="form-control form-control-sm me-2 w-50"
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={0}
                step={0.1}
                max={selectedItem.quantity - selectedItem.actual_stocked}
                required
              />
              / {selectedItem.quantity}
            </div>
            <div className="d-flex justify-content-end mt-2">
              <button
                type="button"
                className="btn btn-sm btn-secondary mt-2 me-2"
                onClick={() => closeModal()}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-sm btn-primary mt-2">
                Registrar
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
