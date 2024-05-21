import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import { Entities, Entity } from "../pages/entities";

const SuppliersRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("ADMIN") && (
        <>
          <Route path="/" element={<Entities />} />
          <Route path="/:id" element={<Entity />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default SuppliersRoutes;
