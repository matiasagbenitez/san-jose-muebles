import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";
import { SweetAlert2 } from "../../utils";
import { ProductForm } from ".";
import { LoadingSpinner } from "../../components";

interface ProductFormInterface {
  code: string;
  name: string;
  description: string;
  id_brand: string;
  id_category: string;
  id_unit: string;
  actual_stock: number;
  inc_stock: number;
  min_stock: number;
  ideal_stock: number;
  last_price: number;
  id_currency: string;
}

export const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductFormInterface>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/products/${id}/editable`);
      setProduct(data.product);
      setLoading(false);
    } catch (error) {
      return navigate("/productos");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const onSubmit = async (formData: any) => {
    try {
      const confirmation = await SweetAlert2.confirm(
        "¿Estás seguro de que deseas modificar este producto?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.put(`/products/${id}`, formData);
      SweetAlert2.successToast(data.message);
      navigate(`/productos/${data.id}`);
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {product && !loading && (
        <>
          <h1 className="fs-4">Editar producto</h1>
          <hr className="my-3" />
          <ProductForm onSubmit={onSubmit} initialForm={product} editMode />
        </>
      )}
    </>
  );
};
