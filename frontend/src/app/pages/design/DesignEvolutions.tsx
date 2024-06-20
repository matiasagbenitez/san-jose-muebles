import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Design, DesignEvolution, DesignStatuses } from "./interfaces";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, SimplePageHeader } from "../../components";
import { Col, ListGroup, Row } from "react-bootstrap";
import { DateFormatter } from "../../helpers";
import { ProjectAccordion } from "./components";

export const DesignEvolutions = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState<Design | null>(null);
  const [evolutions, setEvolutions] = useState<DesignEvolution[]>([]);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/designs/${id}/evolutions`);
      setDesign(data.design);
      setEvolutions(data.evolutions);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/disenos");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return (
    <Fragment>
      {loading && <LoadingSpinner />}
      {!loading && id && design && evolutions && (
        <Fragment>
          <SimplePageHeader
            title="Historial de cambios de estado"
            goBackTo={`/disenos/${id}`}
          />
          <ProjectAccordion design={design} />
          {evolutions.length === 0 ? (
            <div className="mt-3">
              <p className="text-muted fst-italic small">
                No se han registrado cambios de estado en esta instancia de
                diseño
              </p>
            </div>
          ) : (
            <ListGroup className="small mt-3">
              {evolutions.map((evolution) => (
                <ListGroup.Item key={evolution.id}>
                  <Row>
                    <Col xs={12} xl={7}>
                      <span>
                        <b className="small text-muted">{DateFormatter.toDMYH(evolution.createdAt)}</b>
                        {" — "}
                        {evolution.user} actualizó el estado del diseño a{" "}
                        <i
                          className={`ms-1 ${
                            DesignStatuses[evolution.status].icon
                          }`}
                        ></i>
                        <b className="small text-muted">{DesignStatuses[evolution.status].text}</b>
                      </span>
                    </Col>
                    <Col xs={12} xl={5}>
                      {evolution.comment && (
                        <p className="text-muted mb-0 mt-1 small text-uppercase">
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
