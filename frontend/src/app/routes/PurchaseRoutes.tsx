import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import {
  Purchases,
  CreatePurchase,
  Purchase,
  PurchaseReceptions,
} from "../pages/purchases";

const PurchaseRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("ADMIN") && (
        <>
          <Route path="/" element={<Purchases />} />
          <Route path="/registrar" element={<CreatePurchase />} />
          <Route path="/:id" element={<Purchase />} />
          <Route path="/:id/recepciones" element={<PurchaseReceptions />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default PurchaseRoutes;
