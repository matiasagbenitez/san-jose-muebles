import { useState } from "react";
import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { ItemInterface } from "../interfaces";

export const UpdateItemStockForm = ({
  selectedItem,
  updateItemStock,
  showModal,
  setShowModal,
  closeModal,
}: {
  selectedItem: ItemInterface;
  updateItemStock: (e: any, id: number, item: string, quantity: number) => void;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  closeModal: () => void;
}) => {
  const [quantity, setQuantity] = useState<number>(0);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton className="pb-2">
        <Modal.Title>Recepción parcial</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Confirmar la recepción parcial del siguiente producto:</p>
        <h2 className="fs-6 mb-3">
          {selectedItem.product} ({selectedItem.brand})
        </h2>
        <Table size="sm" className="small" bordered responsive>
          <tbody>
            <tr className="text-center">
              <th>COMPRADO</th>
              <th>EN STOCK</th>
              <th>PENDIENTE</th>
            </tr>
          </tbody>
          <tbody>
            <tr className="text-center">
              <td>
                {selectedItem.quantity} {selectedItem.unit}
              </td>
              <td>
                {selectedItem.actual_stocked} {selectedItem.unit}
              </td>
              <td>
                {selectedItem.quantity - selectedItem.actual_stocked}{" "}
                {selectedItem.unit}
              </td>
            </tr>
          </tbody>
        </Table>
        <Form
          onSubmit={(e) => updateItemStock(e, selectedItem.id, selectedItem.product, quantity)}
        >
          <InputGroup className="mb-3" size="sm">
            <InputGroup.Text id="basic-addon1">
              Cantidad recibida
            </InputGroup.Text>
            <Form.Control
              onChange={(e) => setQuantity(Number(e.target.value))}
              type="number"
              placeholder="0"
              min={0.1}
              step={0.1}
              max={selectedItem.quantity - selectedItem.actual_stocked}
              required
            />
            <InputGroup.Text>
              / {selectedItem.quantity - selectedItem.actual_stocked} {selectedItem.unit} restantes
            </InputGroup.Text>
          </InputGroup>
          <div className="d-flex justify-content-end mt-2">
            <Button
              size="sm"
              variant="secondary"
              className="me-2 py-1"
              onClick={() => closeModal()}
            >
              Cancelar
            </Button>
            <Button size="sm" variant="success" className="py-1" type="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
