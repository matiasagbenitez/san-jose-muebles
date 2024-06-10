import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ProjectBasicData,
  ProjectEvolution,
  ProjectStatuses,
} from "./interfaces";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, SimplePageHeader } from "../../components";
import { Accordion, Card, Col, ListGroup, Row } from "react-bootstrap";
import { DateFormatter } from "../../helpers";

export const ProjectEvolutions = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectBasicData | null>(null);
  const [evolutions, setEvolutions] = useState<ProjectEvolution[]>([]);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/projects/${id}/evolutions`);
      setProject(data.project);
      setEvolutions(data.evolutions);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/proyectos");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return (
    <Fragment>
      {loading && <LoadingSpinner />}
      {!loading && id && project && evolutions && (
        <Fragment>
          <SimplePageHeader
            title="Historial de cambios de estado"
            goBackTo={`/proyectos/${id}`}
          />
          <Accordion className="mb-3">
            <Card>
              <Card.Header className="border-0">
                <div className="d-flex flex-column flex-xl-row gap-3 justify-content-between align-items-center">
                  <p className="mb-0 text-center text-lg-start">
                    Proyecto: <b>{`${project.title} - ${project.client}`}</b>
                  </p>
                </div>
              </Card.Header>
            </Card>
          </Accordion>

          {evolutions.length === 0 ? (
            <p className="text-muted fst-italic small">
              No se han registrado cambios de estado en esta instancia de
              proyecto
            </p>
          ) : (
            <ListGroup className="small mb-3">
              {evolutions.map((evolution) => (
                <ListGroup.Item key={evolution.id}>
                  <Row>
                    <Col xs={12} xl={7}>
                      <span>
                        <b>{DateFormatter.toDMYH(evolution.createdAt)}</b>
                        {" - "}
                        {evolution.user} actualizó el estado del proyecto a{" "}
                        <i
                          className={`ms-1 ${
                            ProjectStatuses[evolution.status].icon
                          }`}
                        ></i>
                        <b>{ProjectStatuses[evolution.status].text}</b>
                      </span>
                    </Col>
                    <Col xs={12} xl={5}>
                      {evolution.comment && (
                        <p className="text-muted fst-italic mb-0 mt-1 small text-uppercase">
                          <i className="bi bi-chat-right-text me-1"></i>{" "}
                          {evolution.comment}
                        </p>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};
