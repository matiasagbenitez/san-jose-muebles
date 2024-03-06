import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { SupplierInterface } from "../../interfaces";
import { GoBackButton, LoadingSpinner } from "../../components";
import { ProductInfo, ProductImage, ProductOptions } from ".";

export const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setSupplier] = useState<SupplierInterface>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/products/${id}`);
      setSupplier(data.product);
      setLoading(false);
    } catch (error) {
      return navigate("/productos");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {product && !loading && (
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
                  <ProductOptions />
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
