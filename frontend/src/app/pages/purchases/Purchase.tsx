import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { PurchaseData, PurchaseItems, PurchaseOptions } from "./components";

export const Purchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [purchaseId, setPurchaseId] = useState<number>();
  const [purchase, setPurchase] = useState();
  const [detail, setDetail] = useState();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/purchases/${id}`);
      setPurchaseId(data.purchase.id);
      setPurchase(data.purchase.resume);
      setDetail(data.purchase.detail);
      setLoading(false);
    } catch (error) {
      return navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {purchaseId && purchase && detail && !loading && (
        <>
          <Row>
            <Col xl={6}>
              <h1 className="fs-4">Compra #{purchaseId}</h1>
              <PurchaseData resume={purchase} />
            </Col>
            <Col xl={6}>
              <PurchaseOptions id={purchaseId} />
            </Col>
            <Col xs={12}>
              <h2 className="fs-5">Detalle de productos</h2>
              <PurchaseItems id={purchaseId} detail={detail} />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
