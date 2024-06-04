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
          <div className="my-3">
            <Row className="d-flex align-items-center">
              <Col md={3} lg={2} xxl={1}>
                <Button
                  variant="light border text-muted w-100"
                  size="sm"
                  onClick={() => navigate('/proyectos')}
                  title="Atrás"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Atrás
                </Button>
              </Col>
              <Col md={9} lg={10} xxl={11}>
                <h1 className="fs-5 mb-0 mt-3 mt-md-0">
                  <span className="text-muted">{project.client}:{" "}</span>
                  {project.title}
                </h1>
              </Col>
            </Row>
          </div>

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
