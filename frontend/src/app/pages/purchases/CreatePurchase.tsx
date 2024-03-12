import { useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Instructions, NewPurchaseForm } from "./components";

export const CreatePurchase = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (formData: any) => {
    console.log(formData);
  };

  return (
    <>
      <div className="d-flex align-items-center gap-3">
        <h1 className="fs-4 mb-0">Registrar una nueva compra</h1>
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
      <hr />
      {/* <p className="text-muted small">
        ¿Necesitas ayuda? Puedes consultar las instrucciones para registrar
        una nueva compra haciendo <Button size="sm" className="p-0" variant="link" onClick={handleShow}>click aquí</Button>.
      </p> */}
      <NewPurchaseForm onSubmit={handleSubmit} />
      <>
        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Registrar una nueva compra</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Instructions />
          </Offcanvas.Body>
        </Offcanvas>
      </>
    </>
  );
};
