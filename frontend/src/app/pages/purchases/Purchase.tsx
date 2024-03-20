import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Badge } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { PurchaseData, PurchaseItems, PurchaseOptions } from "./components";
import { ItemInterface } from "./interfaces";
import { SweetAlert2 } from "../../utils";

export const Purchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [purchaseId, setPurchaseId] = useState<number>();
  const [isNullified, setIsNullified] = useState<boolean>(false);
  const [isFullyStocked, setIsFullyStocked] = useState<boolean>(false);
  const [data, setData] = useState();
  const [items, setItems] = useState<ItemInterface[]>();
  const [totals, setTotals] = useState();
  const [nullifiedData, setNullifiedData] = useState();
  const [showModal, setShowModal] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/purchases/${id}`);
      setPurchaseId(data.purchase.id);
      setIsNullified(data.purchase.nullified);
      setIsFullyStocked(data.purchase.fully_stocked);
      setData(data.purchase.data);
      setItems(data.purchase.items);
      setTotals(data.purchase.totals);
      setNullifiedData(data.purchase.nullifiedData);
      setLoading(false);
    } catch (error) {
      return navigate("/compras");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const nullifyPurchase = async () => {
    try {
      const confirmation = await SweetAlert2.confirmationDialog(
        "¿Está seguro de anular la compra?"
      );
      if (!confirmation.isConfirmed) return;
      const { value: reason } = await SweetAlert2.inputDialog(
        "Motivo de anulación"
      );
      if (!reason) return;
      console.log(reason);
      const { data } = await apiSJM.post(`/purchases/${purchaseId}/nullify`, {
        reason,
      });
      setIsNullified(true);
      setNullifiedData(data.nullifiedData);
      SweetAlert2.successToast(data.message);
    } catch (error) {
      return navigate("/");
    }
  };

  const updatePurchaseFullStock = async () => {
    try {
      const confirmation = await SweetAlert2.confirmationDialog(
        "¿Está seguro de actualizar el stock de todos los productos?"
      );
      if (!confirmation.isConfirmed) return;
      await apiSJM.post(`/purchases/${purchaseId}/update-full-stock`);
      if (items) {
        const updatedItems = items.map((item: any) => {
          item.actual_stocked = item.quantity;
          item.fully_stocked = true;
          return item;
        });
        setItems(updatedItems);
        setIsFullyStocked(true);
      }
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  const updateItemFullStock = async (
    e: React.FormEvent,
    id: number,
    quantity_updated: number
  ) => {
    e.preventDefault();
    try {
      const confirmation = await SweetAlert2.confirmationDialog(
        "¿Está seguro de actualizar el stock?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post(
        `/purchases/${purchaseId}/update-item-stock/${id}`,
        { quantity_updated }
      );
      if (items) {
        const updatedItems = items.map((item: any) => {
          if (item.id === data.item.id) {
            item.quantity = data.item.quantity;
            item.actual_stocked = data.item.actual_stocked;
            item.fully_stocked = data.item.fully_stocked;
          }
          return item;
        });
        setIsFullyStocked(data.fully_stocked);
        setItems(updatedItems);
      }
      SweetAlert2.successToast(data.message);
      setShowModal(false);
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {purchaseId && data && items && totals && nullifiedData && !loading && (
        <>
          <Row>
            <Col xl={6}>
              <div className="d-flex justify-content-between align-items-cente">
                <h1 className="fs-4">Compra #{purchaseId}</h1>
                <div className="d-flex align-items-center ">
                  {!isNullified && isFullyStocked ? (
                    <Badge bg="success" className="me-2">
                      STOCK COMPLETO
                    </Badge>
                  ) : (
                    <Badge bg="warning" className="me-2">
                      STOCK PENDIENTE
                    </Badge>
                  )}
                </div>
              </div>
              <PurchaseData
                data={data}
                isNullified={isNullified}
                nullifiedData={nullifiedData}
              />
            </Col>
            <Col xl={6}>
              <PurchaseOptions
                id={purchaseId}
                isFullyStocked={isFullyStocked}
                isNullified={isNullified}
                nullifyPurchase={nullifyPurchase}
                updatePurchaseFullStock={updatePurchaseFullStock}
              />
            </Col>
            <Col xs={12}>
              <h2 className="fs-5">Detalle de productos</h2>
              <PurchaseItems
                id={purchaseId}
                isNullified={isNullified}
                items={items}
                totals={totals}
                updateItemFullStock={updateItemFullStock}
                showModal={showModal}
                setShowModal={setShowModal}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
