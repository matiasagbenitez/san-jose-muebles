import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { GoBackButton, LoadingSpinner } from "../../components";
import { SweetAlert2 } from "../../utils";
import { InfoPurchase, InfoSupplier } from "./components";
import { SupplierInfoProps, PurchaseInfoProps } from "./interfaces";

export const Purchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [purchaseId, setPurchaseId] = useState();
  const [purchase, setPurchase] = useState<PurchaseInfoProps>();
  const [items, setItems] = useState([]);
  const [supplier, setSupplier] = useState<SupplierInfoProps>();
  const [audit, setAudit] = useState();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/purchases/${id}`);
      setPurchaseId(data.purchase.id);
      setPurchase(data.purchase.purchase);
      setItems(data.purchase.items);
      setSupplier(data.purchase.supplier);
      setAudit(data.audit);
      setLoading(false);
    } catch (error) {
      return navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  // const handleDelete = async () => {
  //   try {
  //     const confirmation = await SweetAlert2.confirmationDialog(
  //       "¿Estás seguro de que quieres anular esta compra? Esta acción no se puede deshacer."
  //     );
  //     if (confirmation.isConfirmed) {
  //       await apiSJM.delete(`/purchases/${id}`);
  //       navigate("/compras");
  //       SweetAlert2.successToast("Compra anulada correctamente");
  //     }
  //   } catch (error: any) {
  //     SweetAlert2.errorAlert(error.response.data.message);
  //   }
  // };

  return (
    <>
      {loading && <LoadingSpinner />}
      {purchase && supplier && !loading && (
        <>
          <Row>
            <Col lg={4}>
              <InfoSupplier {...supplier} />
            </Col>
            <Col lg={8}>
              <InfoPurchase {...purchase} />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
