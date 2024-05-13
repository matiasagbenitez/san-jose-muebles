import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import {
  SupplierAccount,
  SupplierAccountTransaction,
  SuppliersAccounts,
} from "../pages/supplier_accounts";

const SupplierAccountRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("ADMIN") && (
        <>
          <Route path="/" element={<SuppliersAccounts />} />
          <Route path="/:id" element={<SupplierAccount />} />
          <Route path="/:id/movimiento/:id_transaction" element={<SupplierAccountTransaction />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default SupplierAccountRoutes;
