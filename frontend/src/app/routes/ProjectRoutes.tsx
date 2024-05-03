import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

import {
  ProjectsList,
  Project,
  ProjectAccounts,
  ProjectAccountTransactions,
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
        </>
      )}

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ProjectRoutes;