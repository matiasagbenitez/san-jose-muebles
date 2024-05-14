import { useState } from "react";
import { useNavigate } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";
import { SweetAlert2 } from "../../utils";
import { ProductForm } from ".";

export const ProductCreate = () => {
  const navigate = useNavigate();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const onSubmit = async (formData: any) => {
    try {
      setIsFormSubmitting(true);
      const confirmation = await SweetAlert2.confirm(
        "¿Estás seguro de que deseas crear este producto?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post("/products", formData);
      SweetAlert2.successToast(data.message);
      navigate(`/productos/${data.id}`);
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="fs-5">Registrar un nuevo producto</h1>
      <hr className="my-3" />
      <ProductForm onSubmit={onSubmit} isSubmitting={isFormSubmitting} />
    </div>
  );
};
