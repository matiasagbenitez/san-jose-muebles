import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import {
    InventoryItems,
    InventoryItem,
} from "../pages/inventory_items";

const InventoryItemsRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("ADMIN") && (
        <>
          <Route path="/" element={<InventoryItems />} />
          <Route path=":id" element={<InventoryItem />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default InventoryItemsRoutes;
