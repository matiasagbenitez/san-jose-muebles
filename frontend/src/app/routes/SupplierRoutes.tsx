import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import {
  Supplier,
  Suppliers,
  SupplierBankAccounts,
  SupplierAccounts,
  SupplierPurchases,
  SupplierAccountTransactions,
  SuppliersAccounts,
} from "../pages/suppliers";

const SuppliersRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("ADMIN") && (
        <>
          <Route path="/" element={<Suppliers />} />
          <Route path="/cuentas" element={<SuppliersAccounts />} />
          <Route path="/:id" element={<Supplier />} />
          <Route path="/:id/cuentas" element={<SupplierAccounts />} />  
          <Route path="/:id/cuentas/:id_supplier_account" element={<SupplierAccountTransactions />} />


          <Route path="/:id/cuentas-bancarias" element={<SupplierBankAccounts />} />
          <Route path="/:id/compras" element={<SupplierPurchases />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default SuppliersRoutes;
