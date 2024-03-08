import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { GoBackButton, LoadingSpinner } from "../../components";
import { ProductInfo, ProductImage, ProductOptions } from ".";
import { SweetAlert2 } from "../../utils";

export const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productId, setProductId] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/products/${id}`);
      setProduct(data.product);
      setProductId(data.product.id);
      setLoading(false);
    } catch (error) {
      return navigate("/productos");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleDelete = async () => {
    try {
      const confirmation = await SweetAlert2.confirmationDialog(
        "¿Estás seguro de que deseas eliminar este producto?"
      );
      if (!confirmation) return;
      setLoading(true);
      await apiSJM.delete(`/products/${productId}`);
      setLoading(false);
      SweetAlert2.successToast("Producto eliminado");
      navigate("/productos");
    } catch (error: any) {
      setLoading(false);
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {product && !loading && productId && (
        <>
          <Row>
            <h1 className="fs-4">{product.name}</h1>
            <Col lg={8}>
              <ProductInfo product={product} />
            </Col>
            <Col lg={4}>
              <Row>
                <Col xs={12}>
                  <ProductImage />
                </Col>
                <Col xs={12}>
                  <ProductOptions id={productId} handleDelete={handleDelete} />
                </Col>
              </Row>
            </Col>
          </Row>
          <GoBackButton />
        </>
      )}
    </>
  );
};
