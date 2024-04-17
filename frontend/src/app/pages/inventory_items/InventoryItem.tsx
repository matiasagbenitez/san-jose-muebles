import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { ItemData, ItemRetirements, ItemUpdates, Options } from "./components";

export const InventoryItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [item, setItem] = useState<any>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/inventory_items/${id}`);
      setItem(data.item);
      setLoading(false);
    } catch (error) {
      return navigate("/inventory_items");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Row>
          <div className="d-flex gap-3 align-items-center mb-3">
            <Button
              variant="light border text-muted"
              size="sm"
              onClick={() => navigate(`/inventario`)}
              title="Volver al inventario de artículos"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Atrás
            </Button>
            <h1 className="fs-5 my-0">{item.data.name}</h1>
          </div>
          <Col lg={6}>
            <ItemData item={item.data} />
          </Col>
          <Col lg={6}>
            <Options />
          </Col>
          <Col lg={6}>
            <ItemUpdates updates={item.updates} />
          </Col>
          <Col>{/* NOTHING */}</Col>
          <Col lg={6}>
            <ItemRetirements retirements={item.retirements} />
          </Col>
        </Row>
      )}
    </>
  );
};
