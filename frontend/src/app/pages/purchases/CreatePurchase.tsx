import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Offcanvas, Button } from "react-bootstrap";
import { Instructions, PurchaseForm } from "./components";
import apiSJM from "../../../api/apiSJM";
import { SweetAlert2 } from "../../utils";

export const CreatePurchase = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsFormSubmitting(true);
    try {
      const confirmation = await SweetAlert2.confirm(
        "¿Desea registrar la compra?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post("/purchases/v2", formData);
      console.log(data);
      SweetAlert2.successToast(data.message);
      navigate(`/compras/${data.id}`);
    } catch (error: any) {
      console.log(error.response.data.message);
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitting(false);
    }
  };

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

      <PurchaseForm
        onSubmit={handleSubmit}
        isFormSubmitting={isFormSubmitting}
      />

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
