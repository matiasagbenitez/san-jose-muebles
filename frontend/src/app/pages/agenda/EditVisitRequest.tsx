import { VisitForm } from "./components";
import { VisitFormInterface } from "./interfaces";
import { SweetAlert2 } from "../../utils";
import apiSJM from "../../../api/apiSJM";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../../components";

export const EditVisitRequest = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [visit, setVisit] = useState<VisitFormInterface>();
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

  const handleSubmit = async (formData: VisitFormInterface) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de actualizar la visita?"
    );
    if (!confirmation.isConfirmed) return;

    try {
      const { data } = await apiSJM.put(`/visit_requests/${id}`, formData);
      SweetAlert2.successToast(
        data.message || "Visita actualizada correctamente"
      );
      navigate("/agenda");
    } catch (error) {
      console.log(error);
      SweetAlert2.errorAlert("Error al actualizar la visita");
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && visit && (
        <VisitForm editMode initialForm={visit} onSubmit={handleSubmit} />
      )}
    </>
  );
};
