import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { VisitForm } from "./components";
import { VisitRequestFormInterface } from "./interfaces";
import { SweetAlert2 } from "../../utils";
import apiSJM from "../../../api/apiSJM";

export const CreateVisitRequest = () => {
  const navigate = useNavigate();
  
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const handleSubmit = async (formData: VisitRequestFormInterface) => {
    const confirmation = await SweetAlert2.confirm("¿Estás seguro de crear la visita?");
    if (!confirmation.isConfirmed) return;

    try {
      setIsFormSubmitting(true);
      const { data } = await apiSJM.post("/visit_requests", formData);
      SweetAlert2.successToast(data.message || "Visita creada correctamente");
      navigate("/agenda");
    } catch (error) {
      console.log(error);
      SweetAlert2.errorAlert("Error al crear la visita");
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <>
      <div className="d-flex gap-3 align-items-center mb-3">
        <Button
          variant="light border text-muted"
          size="sm"
          onClick={() => navigate(`/agenda`)}
          title="Volver al listado de visitas"
          className="col-1"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Atrás
        </Button>
        <h1 className="fs-5 my-0">Registrar una nueva visita</h1>
      </div>
      <hr className="my-3" />
      <VisitForm onSubmit={handleSubmit} submitting={isFormSubmitting} />
    </>
  );
};
