import { VisitForm } from "./components";
import { VisitRequestFormInterface } from "./interfaces";
import { SweetAlert2 } from "../../utils";
import apiSJM from "../../../api/apiSJM";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export const CreateVisitRequest = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: VisitRequestFormInterface) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de crear la visita?"
    );
    if (!confirmation.isConfirmed) return;

    try {
      const { data } = await apiSJM.post("/visit_requests", formData);
      SweetAlert2.successToast(data.message || "Visita creada correctamente");
      navigate("/agenda");
    } catch (error) {
      SweetAlert2.errorAlert("Error al crear la visita");
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
        >
          <i className="bi bi-arrow-left me-2"></i>
          Atrás
        </Button>
        <h1 className="fs-5 my-0">Registrar una nueva solicitud de visita</h1>
      </div>
      <hr className="my-3" />
      <VisitForm onSubmit={handleSubmit} />
    </>
  );
};
