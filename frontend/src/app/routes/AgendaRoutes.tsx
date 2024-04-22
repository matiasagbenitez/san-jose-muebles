import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import { CreateVisitRequest, VisitRequests, VisitRequest, EditVisitRequest } from "../pages/agenda";

const AgendaRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("ADMIN") && (
        <>
          <Route path="/" element={<VisitRequests />} />
          <Route path="/crear" element={<CreateVisitRequest />} />
          <Route path="/:id" element={<VisitRequest />} />
          <Route path="/:id/editar" element={<EditVisitRequest />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AgendaRoutes;
