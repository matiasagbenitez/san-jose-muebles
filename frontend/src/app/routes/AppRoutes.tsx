import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../layout/Layout";
import { Inicio } from "../pages/Inicio";
import { useAuthStore } from "../../hooks";
import { useEffect } from "react";

const AppRoutes = () => {
  const { checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Inicio />} />
      </Route>

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
