import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { ProductInfo, ProductImage, ProductOptions, ProductPending } from ".";
import { SweetAlert2 } from "../../utils";
import { ProductPendingReception } from "./interfaces";

export const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productId, setProductId] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [pendingReceptions, setPendingReceptions] = useState<
    ProductPendingReception[]
  >([]);
  const [product, setProduct] = useState<any>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/products/${id}`);
      setProduct(data.product);
      setPendingReceptions(data.pending_receptions);
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
      const confirmation = await SweetAlert2.confirm(
        "¿Estás seguro de que deseas eliminar este producto?"
      );
      if (!confirmation.isConfirmed) return;
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
            <div className="d-flex gap-3 align-items-center mb-3">
              <Button
                variant="light border text-muted col-2"
                size="sm"
                onClick={() => navigate(`/productos`)}
                title="Volver al listado de productos"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Atrás
              </Button>
              <h1 className="fs-5 my-0">{product.name}</h1>
            </div>
            <Col lg={9}>
              <ProductInfo product={product} />
              {pendingReceptions.length > 0 && (
                <ProductPending pendingReceptions={pendingReceptions} />
              )}
            </Col>
            <Col sm={12} lg={3}>
              <Row>
                <Col xs={12} sm={4} lg={12}>
                  <ProductImage />
                </Col>
                <Col xs={12} sm={8} lg={12}>
                  <ProductOptions id={productId} handleDelete={handleDelete} />
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
