import { useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Instructions, PurchaseForm } from "./components";

export const CreatePurchase = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="d-flex align-items-center gap-2">
        <h1 className="fs-5 my-0">Registrar nueva compra de productos</h1>
        <Button
          size="sm"
          variant="transparent"
          onClick={handleShow}
          className="text-muted"
          title="Ver instrucciones"
        >
          <i className="bi bi-question-circle"></i>&ensp;Instrucciones
        </Button>
      </div>

      <hr className="my-3" />

      <PurchaseForm />

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Registrar una nueva compra</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Instructions />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
