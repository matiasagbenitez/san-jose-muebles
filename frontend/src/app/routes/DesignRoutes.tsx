import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import {
  Design,
  DesignEvolutions,
  DesignFiles,
  Designs,
  DesignTaskEvolutions,
} from "../pages/design";

const DesignRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("ADMIN") && (
        <>
          <Route path="/" element={<Designs />} />
          <Route path="/:id" element={<Design />} />
          <Route path="/:id/historial" element={<DesignEvolutions />} />
          <Route
            path="/:id/tarea/:id_task/historial"
            element={<DesignTaskEvolutions />}
          />
          <Route path="/:id/archivos" element={<DesignFiles />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default DesignRoutes;
