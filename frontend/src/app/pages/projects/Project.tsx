import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

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
            goBackTo="/proyectos"
            goBackTitle="Volver al listado de proyectos"
            title="Detalle del proyecto"
          />
          <Row>
            <Col xs={12} xl={8}>
              <Data project={project} />
            </Col>
            <Col xs={12} xl={4}>
              <Options id={project.id} />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};
