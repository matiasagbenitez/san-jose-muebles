import { VisitForm } from "./components";
import { VisitRequestFormInterface } from "./interfaces";
import { SweetAlert2 } from "../../utils";
import apiSJM from "../../../api/apiSJM";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../../components";
import { Button } from "react-bootstrap";

export const EditVisitRequest = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [visit, setVisit] = useState<VisitRequestFormInterface>();
  const navigate = useNavigate();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/visit_requests/${id}/editable`);
      setVisit(data.item);
      console.log(data.item);
      setLoading(false);
    } catch (error) {
      return navigate("/agenda");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSubmit = async (formData: VisitRequestFormInterface) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de actualizar la visita?"
    );
    if (!confirmation.isConfirmed) return;

    try {
      setIsFormSubmitting(true);
      const { data } = await apiSJM.put(`/visit_requests/${id}`, formData);
      SweetAlert2.successToast(
        data.message || "Visita actualizada correctamente"
      );
      navigate("/agenda");
    } catch (error) {
      console.log(error);
      SweetAlert2.errorAlert("Error al actualizar la visita");
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
          onClick={() => navigate(`/agenda/${id}`)}
          title="Volver al detalle de la visita"
          className="col-1"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Atrás
        </Button>
        <h1 className="fs-5 my-0">Modificar datos de la visita</h1>
      </div>
      <hr className="my-3" />
      {loading && <LoadingSpinner />}
      {!loading && visit && (
        <VisitForm
          editMode
          initialForm={visit}
          onSubmit={handleSubmit}
          submitting={isFormSubmitting}
        />
      )}
    </>
  );
};
