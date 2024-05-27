import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button, Badge } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import {
  PurchaseData,
  PurchaseItems,
  PurchaseNullation,
  PurchaseOptions,
} from "./components";
import { NullationInterface, ItemInterface } from "./interfaces";
import { SweetAlert2 } from "../../utils";

export const Purchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [purchaseId, setPurchaseId] = useState<number>();
  const [supplierId, setSupplierId] = useState<number>();
  const [status, setStatus] = useState<"VALIDA" | "ANULADA">("VALIDA");
  const [isFullyStocked, setIsFullyStocked] = useState<boolean>(false);

  const [resume, setResume] = useState();
  const [items, setItems] = useState<ItemInterface[]>();
  const [totals, setTotals] = useState();

  const [nullation, setNullation] = useState<NullationInterface | null>();
  const [supplierAccountId, setSupplierAccountId] = useState<number>();

  const [showModal, setShowModal] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/purchases/${id}`);

      setPurchaseId(data.purchase.id);
      setStatus(data.purchase.status);
      setIsFullyStocked(data.purchase.fully_stocked);
      setResume(data.purchase.resume);
      setSupplierId(data.purchase.resume.supplier.id);
      setItems(data.purchase.items);
      setTotals(data.purchase.totals);
      setNullation(data.purchase.nullation);
      setSupplierAccountId(data.account);

      setLoading(false);
    } catch (error: any) {
      console.log(error.response.data.message);
      return navigate("/compras");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const nullifyPurchase = async () => {
    try {
      const { value: reason } = await SweetAlert2.inputDialog(
        "Motivo de anulación"
      );
      if (!reason) return;

      const confirmation = await SweetAlert2.confirm(
        "¿Está seguro de anular la compra?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post(`/purchases/${purchaseId}/nullify`, {
        reason,
      });
      fetch();
      SweetAlert2.successToast(data.message);
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  const updatePurchaseFullStock = async () => {
    try {
      const confirmation = await SweetAlert2.confirm(
        "¿Está seguro de actualizar el stock de todos los productos?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post(
        `/purchases/${purchaseId}/update-full-stock`
      );
      if (items) {
        const updatedItems = items.map((item: any) => {
          item.actual_stocked = item.quantity;
          item.fully_stocked = true;
          return item;
        });
        setItems(updatedItems);
        setIsFullyStocked(true);
      }
      SweetAlert2.successToast(data.message);
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
      {purchaseId &&
        resume &&
        items &&
        totals &&
        status &&
        !loading &&
        supplierAccountId &&
        supplierId && (
          <>
            <Row>
              {status === "ANULADA" && (
                <PurchaseNullation nullation={nullation} />
              )}
              <Col xl={8}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex gap-3 align-items-center">
                    <Button
                      variant="light border text-muted"
                      size="sm"
                      onClick={() => navigate(`/compras`)}
                      title="Volver al listado de compras"
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Atrás
                    </Button>
                    <h1 className="fs-4 my-0">
                      Compra #{purchaseId}
                      {status === "ANULADA" ? (
                        <i
                          className="bi bi-x-circle-fill text-danger fs-5 ms-2"
                          title="Compra anulada"
                        ></i>
                      ) : (
                        <i
                          className="bi bi-check-circle-fill text-success fs-5 ms-2"
                          title="Compra válida"
                        ></i>
                      )}
                    </h1>
                  </div>
                  <div className="d-flex align-items-center ">
                    {status === "VALIDA" &&
                      (isFullyStocked ? (
                        <Badge bg="success" className="me-2">
                          STOCK COMPLETO
                        </Badge>
                      ) : (
                        <Badge bg="warning" className="me-2">
                          STOCK PENDIENTE
                        </Badge>
                      ))}
                  </div>
                </div>
                <PurchaseData resume={resume} />
              </Col>
              <Col xl={4}>
                <PurchaseOptions
                  id={purchaseId}
                  isFullyStocked={isFullyStocked}
                  status={status}
                  nullifyPurchase={nullifyPurchase}
                  updatePurchaseFullStock={updatePurchaseFullStock}
                  accountId={supplierAccountId}
                  supplierId={supplierId}
                />
              </Col>
              <Col xs={12}>
                <h2 className="fs-6">Detalle de productos</h2>
                <PurchaseItems
                  status={status}
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
