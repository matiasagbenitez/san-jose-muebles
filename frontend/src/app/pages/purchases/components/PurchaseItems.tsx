import { useState } from "react";
import { Dropdown, Table, Modal } from "react-bootstrap";
import { DetailInterface, ItemInterface } from "../interfaces";
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
  id: purchaseId,
  detail,
}: {
  id: number;
  detail: DetailInterface;
}) => {
  const { items, is_monetary } = detail;

  const [itemsList, setItemsList] = useState<ItemInterface[]>(items);

  const [showModal, setShowModal] = useState(false);
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

  const updateStock = async ( e: React.FormEvent, id: number, quantity_updated: number ) => {
    e.preventDefault();

    try {
      const confirmation = await SweetAlert2.confirmationDialog("¿Está seguro de actualizar el stock?");
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post(`/purchases/${purchaseId}/update-item-stock/${id}`,{ quantity_updated });

      const updatedItems: ItemInterface[] = itemsList.map((item) => {
        if (item.id === data.item.id) {
          item.quantity = data.item.quantity;
          item.actual_stocked = data.item.actual_stocked;
          item.fully_stocked = data.item.fully_stocked;
        }
        return item;
      });

      setItemsList(updatedItems);
      SweetAlert2.successToast(data.message);
      closeModal();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
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
          {itemsList.map((item) => (
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
                {!item.fully_stocked && (
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
                          updateStock(e, item.id, Number(item.quantity))
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
          <form onSubmit={(e) => updateStock(e, selectedItem.id, quantity)}>
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
