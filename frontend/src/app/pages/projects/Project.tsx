import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";
import { Data, Options } from "./components";
import { LoadingSpinner, SimplePageHeader } from "../../components";
import { ProjectDetailInterface } from "./interfaces";

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
            title={`Proyecto N° ${project.id}`}
            hr
            goBackTo="/proyectos"
          />
          <Options id={project.id} />
          <Data project={project} />
        </>
      )}
    </div>
  );
};
