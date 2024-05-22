import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import {
  Entities,
  Entity,
  EntityAccounts,
  EntityAccountTransaction,
  EntityAccountTransactions,
  EntitiesAccounts,
} from "../pages/entities";

const SuppliersRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("ADMIN") && (
        <>
          <Route path="/" element={<Entities />} />
          <Route path="/cuentas" element={<EntitiesAccounts />} />
          <Route path="/:id" element={<Entity />} />
          <Route path="/:id/cuentas" element={<EntityAccounts />} />
          <Route path="/:id/cuentas/:id_entity_account" element={<EntityAccountTransactions />} />
          <Route path="/:id/cuentas/:id_entity_account/movimiento/:id_transaction" element={<EntityAccountTransaction />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default SuppliersRoutes;
