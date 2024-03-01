import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import { Countries, Provinces, Cities, Currencies, PaymentMethods, TypesOfEnvironments, Brands } from "../pages/parameters";

const ParametersRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("ADMIN") && (
        <>
          <Route path="/paises" element={<Countries />} />
          <Route path="/provincias" element={<Provinces />} />
          <Route path="/ciudades" element={<Cities />} />
          <Route path="/monedas" element={<Currencies />} />
          <Route path="/metodos-pago" element={<PaymentMethods />} />
          <Route path="/tipos-ambientes" element={<TypesOfEnvironments />} />
          <Route path="/marcas" element={<Brands />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ParametersRoutes;
