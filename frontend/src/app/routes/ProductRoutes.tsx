import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import { Products, Product, ProductCreate, ProductEdit, StockAdjust, Lots, Lot } from "../pages/products";

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
          {/* <Route path="/:id/ajuste-stock" element={<StockAdjust />} /> */}

          <Route path="/ajustes" element={<Lots />} />
          <Route path="/ajustes/:id" element={<Lot />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ProductRoutes;
