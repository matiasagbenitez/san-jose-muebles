import { useNavigate } from "react-router-dom";
import apiSJM from "../../../../api/apiSJM";
import { SweetAlert2 } from "../../../utils";

interface PurchaseOptionsProps {
  id: number;
}

export const PurchaseOptions = ({ id }: PurchaseOptionsProps) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const confirmation = await SweetAlert2.confirmationDialog(
        "¿Está seguro que desea anular la compra?"
      );
      if (confirmation.isConfirmed) {
        const { data } = await apiSJM.delete(`/purchases/${id}`);
        SweetAlert2.successToast(data.message);
        navigate("/compras");
      }
    } catch (error) {
      SweetAlert2.errorAlert("Error al anular la compra");
    }
  };

  const handleUpdateFullyStocked = async () => {
    try {
      const confirmation = await SweetAlert2.confirmationDialog(
        "¿Está seguro que desea marcar todos los productos como recibidos?"
      );
      if (confirmation.isConfirmed) {
        const { data } = await apiSJM.put(
          `/purchases/${id}/update-full-stock`
        );
        SweetAlert2.successToast(data.message);
        navigate(`/compras/${id}`);
      }
    } catch (error) {
      SweetAlert2.errorAlert("Error al marcar todos los productos como recibidos");
    }
  }

  return (
    <div className="mb-4">
      <h2 className="fs-6 mt-2">Menú de opciones</h2>
      <div className="list-group small">
        <button
          className="list-group-item list-group-item-action py-1"
          title="Gestionar pagos realizados"
        >
          <i className="bi bi-cash-stack me-2 fs-6"></i>
          Gestionar pagos realizados
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Marcar todos los productos como recibidos"
          onClick={handleUpdateFullyStocked}
        >
          <i className="bi bi-check2-square me-2 fs-56"></i>
          Marcar todos los productos como recibidos
        </button>
        <button
          className="list-group-item list-group-item-action py-1"
          title="Generar un reporte de la compra"
        >
          <i className="bi bi-receipt me-2 fs-56"></i>
          Generar un reporte de la compra
        </button>
        <button
          className="list-group-item list-group-item-action py-1 text-danger"
          title="Anular compra (esta acción no se puede deshacer)"
          onClick={handleDelete}
        >
          <i className="bi bi-x-circle-fill me-2 fs-6"></i>
          Anular compra
        </button>
      </div>
    </div>
  );
};
