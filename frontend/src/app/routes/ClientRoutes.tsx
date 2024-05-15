import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import { Clients, Client, ClientProjects } from "../pages/clients";

const SuppliersRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("ADMIN") && (
        <>
          <Route path="/" element={<Clients />} />
          <Route path="/:id" element={<Client />} />
          <Route path="/:id/proyectos" element={<ClientProjects />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default SuppliersRoutes;
