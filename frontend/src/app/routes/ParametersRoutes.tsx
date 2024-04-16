import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import {
  Parameters,
  Countries,
  Provinces,
  Localities,
  Currencies,
  PaymentMethods,
  TypesOfEnvironments,
  Brands,
  Categories,
  UnitsOfMeasures,
  Priorities,
  TypesOfProjects,
  Banks,
  InventoryBrands,
  InventoryCategories,
} from "../pages/parameters";

const ParametersRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("ADMIN") && (
        <>
          <Route path="/" element={<Parameters />} />
          <Route path="/paises" element={<Countries />} />
          <Route path="/provincias" element={<Provinces />} />
          <Route path="/localidades" element={<Localities />} />
          <Route path="/monedas" element={<Currencies />} />
          <Route path="/metodos-pago" element={<PaymentMethods />} />
          <Route path="/tipos-ambientes" element={<TypesOfEnvironments />} />
          <Route path="/marcas" element={<Brands />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/unidades-medida" element={<UnitsOfMeasures />} />
          <Route path="/prioridades" element={<Priorities />} />
          <Route path="/tipos-proyectos" element={<TypesOfProjects />} />
          <Route path="/bancos" element={<Banks />} />
          <Route path="/marcas-herramientas" element={<InventoryBrands />} />
          <Route path="/categorias-herramientas" element={<InventoryCategories />} />

        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ParametersRoutes;
