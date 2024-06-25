import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";
import { Data, Options } from "./components";
import { LoadingSpinner, SimplePageHeader } from "../../components";
import { ProjectDetailInterface } from "./interfaces";
import { DateFormatter } from "../../helpers";

export const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectDetailInterface>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/projects/${id}`);
      setProject(data.item);
      setLoading(false);
    } catch (error) {
      return navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return (
    <div>
      {loading && <LoadingSpinner />}
      {!loading && project && (
        <>
          <SimplePageHeader
            title={`PROYECTO N° ${project.id} — ${project.title} — ${project.client}`}
            goBackTo="/proyectos"
          />
          <Options id={project.id} />
          <Data project={project} />
          <p className="small text-muted mt-3">
            <i className="bi bi-info-circle me-2"></i>
            Proyecto registrado en el sistema el{" "}
            {DateFormatter.toDMYHText(project.createdAt)}
          </p>
        </>
      )}
    </div>
  );
};
