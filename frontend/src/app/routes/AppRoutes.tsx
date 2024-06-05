import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../layout/Layout";
import { Inicio } from "../pages/Inicio";
import ParametersRoutes from "./ParametersRoutes";
import SuppliersRoutes from "./SupplierRoutes";
import ProductRoutes from "./ProductRoutes";
import PurchaseRoutes from "./PurchaseRoutes";
import InventoryItemsRoutes from "./InventoryItemsRoutes";
import ClientRoutes from "./ClientRoutes";
import AgendaRoutes from "./AgendaRoutes";
import ProjectRoutes from "./ProjectRoutes";
import GroupRoutes from './GroupRoutes';
import EntityRoutes from "./EntityRoutes";
import EnvironmentRoutes from "./EnvironmentRoutes";
import DesignRoutes from "./DesignRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/parametros/*" element={<ParametersRoutes />} />
        <Route path="/proveedores/*" element={<SuppliersRoutes />} />
        <Route path="/productos/*" element={<ProductRoutes />} />
        <Route path="/compras/*" element={<PurchaseRoutes />} />
        <Route path="/inventario/*" element={<InventoryItemsRoutes />} />
        <Route path="/clientes/*" element={<ClientRoutes />} />
        <Route path="/agenda/*" element={<AgendaRoutes />} />
        <Route path="/proyectos/*" element={<ProjectRoutes />} />
        <Route path="/grupos/*" element={<GroupRoutes />} />
        <Route path="/entidades/*" element={<EntityRoutes />} />
        <Route path="/ambientes/*" element={<EnvironmentRoutes />} />
        <Route path="/disenos/*" element={<DesignRoutes />} />
      </Route>

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
