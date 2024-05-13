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
          <Row className="mb-0 mb-lg-3 d-flex align-items-center">
            <Col xs={12} sm={2} xxl={1}>
              <Button
                variant="light border text-muted"
                size="sm"
                onClick={() => navigate(`/proyectos`)}
                title="Volver al listado de proyectos"
                className="w-100"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Atrás
              </Button>
            </Col>
            <Col xs={12} sm={10} xx g={11}>
              <h1 className="fs-5 my-3 my-lg-0">Detalle de proyecto</h1>
            </Col>
          </Row>
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
