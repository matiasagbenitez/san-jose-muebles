import { useNavigate } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";
import { SweetAlert2 } from "../../utils";
import { ProductForm } from ".";

export const ProductCreate = () => {
  const navigate = useNavigate();

  const onSubmit = async (formData: any) => {
    try {
      const confirmation = await SweetAlert2.confirmationDialog(
        "¿Estás seguro de que deseas crear este producto?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post("/products", formData);
      SweetAlert2.successToast(data.message);
      navigate("/productos");
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <div>
      <h1 className="fs-3">Nuevo producto</h1>
      <hr className="my-2" />
      <ProductForm onSubmit={onSubmit} />
    </div>
  );
};
