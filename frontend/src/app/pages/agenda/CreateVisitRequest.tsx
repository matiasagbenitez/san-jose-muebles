import { VisitForm } from "./components";
import { VisitRequestFormInterface } from "./interfaces";
import { SweetAlert2 } from "../../utils";
import apiSJM from "../../../api/apiSJM";
import { useNavigate } from "react-router-dom";

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

  return <VisitForm onSubmit={handleSubmit} />;
};
