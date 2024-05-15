import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import {
  ProjectsList,
  Project,
  ProjectAccounts,
  ProjectAccountTransactions,
  ProjectAccountTransaction,
  ProjectRelatedPersons,
  ProjectEstimates,
  ProjectCreateEstimate,
} from "../pages/projects";

const ProjectRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {roles.includes("USER") && (
        <>
          <Route path="/" element={<ProjectsList />} />
          <Route path="/:id" element={<Project />} />
          <Route path="/:id/cuentas" element={<ProjectAccounts />} />
          <Route path="/:id/cuentas/:id_project_account" element={<ProjectAccountTransactions />} />
          <Route path="/:id/cuentas/:id_project_account/movimiento/:id_transaction" element={<ProjectAccountTransaction />} />
          <Route path="/:id/personas-relacionadas" element={<ProjectRelatedPersons />} />
          <Route path="/:id/presupuestos" element={<ProjectEstimates />} />
          <Route path="/:id/presupuestos/nuevo" element={<ProjectCreateEstimate />} />
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ProjectRoutes;
