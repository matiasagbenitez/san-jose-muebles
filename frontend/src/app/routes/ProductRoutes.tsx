import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import { Products, Product, ProductCreate, ProductEdit, Lots, Lot, LotCreate } from "../pages/products";

const ProductRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("USER") && (
        <>
          <Route path="/" element={<Products />} />
          <Route path="/:id" element={<Product />} />
          <Route path="/nuevo" element={<ProductCreate />} />
          <Route path="/:id/editar" element={<ProductEdit />} />

          <Route path="/ajustes" element={<Lots />} />
          <Route path="/ajustes/:id" element={<Lot />} />
          <Route path="/ajustes/nuevo" element={<LotCreate />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ProductRoutes;
