import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../layout/Layout";
import { Inicio } from "../pages/Inicio";
import ParametersRoutes from "./ParametersRoutes";
import SuppliersRoutes from "./SupplierRoutes";
import ProductRoutes from "./ProductRoutes";
import PurchaseRoutes from "./PurchaseRoutes";
import SupplierAccountRoutes from "./SupplierAccountRoutes";
import InventoryItemsRoutes from "./InventoryItemsRoutes";
import ClientRoutes from "./ClientRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/parametros/*" element={<ParametersRoutes />} />
        <Route path="/proveedores/*" element={<SuppliersRoutes />} />
        <Route path="/productos/*" element={<ProductRoutes />} />
        <Route path="/compras/*" element={<PurchaseRoutes />} />
        <Route path="/cuentas-proveedores/*" element={<SupplierAccountRoutes />} />
        <Route path="/inventario/*" element={<InventoryItemsRoutes />} />
        <Route path="/clientes/*" element={<ClientRoutes />} />
      </Route>

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
