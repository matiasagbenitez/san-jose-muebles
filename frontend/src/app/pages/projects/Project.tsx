import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { Data, Options } from "./components";
import { LoadingSpinner } from "../../components";
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
          <Row>
            <Col lg={8}>
              <div className="d-flex gap-3 align-items-center mb-3">
                <Button
                  variant="light border text-muted"
                  size="sm"
                  onClick={() => navigate(`/proyectos`)}
                  title="Volver al listado de proyectos"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Atrás
                </Button>
                <h1 className="fs-5 my-0">Detalle de proyecto</h1>
              </div>
              <Data project={project} />
            </Col>
            <Col lg={4}>
              <Options id={project.id} />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};
