import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Offcanvas, Button } from "react-bootstrap";
import { Instructions, NewPurchaseForm } from "./components";
import apiSJM from "../../../api/apiSJM";
import { SweetAlert2 } from "../../utils";

export const CreatePurchase = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (formData: any) => {
    try {
      const confirmation = await SweetAlert2.confirm("¿Desea registrar la compra?");
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post("/purchases", formData);
      SweetAlert2.successToast(data.message);
      navigate(`/compras/${data.id}`);
      // navigate("/compras");
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
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
