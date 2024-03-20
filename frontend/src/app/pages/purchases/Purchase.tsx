import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import {
  PurchaseData,
  PurchaseItems,
  PurchaseNullified,
  PurchaseOptions,
  PurchaseTitle,
} from "./components";
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
      const confirmation = await SweetAlert2.confirm(
        "¿Está seguro de anular la compra?"
      );
      if (!confirmation.isConfirmed) return;
      const { value: reason } = await SweetAlert2.inputDialog(
        "Motivo de anulación"
      );
      if (!reason) return;
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
      const confirmation = await SweetAlert2.confirm(
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

  const updateItemStock = async (
    e: React.FormEvent,
    id: number,
    item: string,
    quantity_received: number
  ) => {
    e.preventDefault();
    try {
      const confirmation = await SweetAlert2.confirm(
        "¿Actualizar el stock del producto " + item + "?"
      );
      const endpoint = `/purchases/${purchaseId}/update-item-stock/${id}`;
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post(endpoint, { quantity_received });
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
            {isNullified && (
              <Col xs={12}>
                <PurchaseNullified nullifiedData={nullifiedData} />
              </Col>
            )}
            <Col xl={6}>
              <PurchaseTitle
                purchaseId={purchaseId}
                isNullified={isNullified}
                isFullyStocked={isFullyStocked}
              />
              <PurchaseData data={data} />
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
                isNullified={isNullified}
                items={items}
                totals={totals}
                updateItemStock={updateItemStock}
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
