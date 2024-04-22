import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import { VisitRequests } from "../pages/agenda";

const AgendaRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("ADMIN") && (
        <>
          <Route path="/" element={<VisitRequests />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AgendaRoutes;
