import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Design, DesignEvolution, DesignStatuses } from "./interfaces";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, SimplePageHeader } from "../../components";
import {
  Accordion,
  Button,
  Card,
  ListGroup,
  Row,
  useAccordionButton,
} from "react-bootstrap";
import { DateFormatter } from "../../helpers";

function CustomToggle({ children, eventKey }: any) {
  const decoratedOnClick = useAccordionButton(eventKey);
  return (
    <Button
      size="sm"
      variant="transparent"
      type="button"
      className="py-1"
      onClick={decoratedOnClick}
    >
      {children}
    </Button>
  );
}

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
          <Accordion className="mb-3">
            <Card>
              <Card.Header className="border-0">
                <div className="d-flex flex-column flex-xl-row gap-3 justify-content-between align-items-center">
                  <p className="mb-0 text-center text-lg-start">
                    Instancia de diseño:{" "}
                    <b>{`${design.type} - ${design.project} - ${design.client}`}</b>
                  </p>

                  <CustomToggle eventKey="0">
                    <small className="me-2 text-muted">VER MÁS</small>
                    <i className="bi bi-chevron-down text-muted "></i>
                  </CustomToggle>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body className="small">{design.description}</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>

          {evolutions.length === 0 ? (
            <p className="text-muted fst-italic small">
              No se han registrado cambios de estado en esta instancia de diseño
            </p>
          ) : (
            <ListGroup className="small mb-3">
              {evolutions.map((evolution) => (
                <ListGroup.Item key={evolution.id}>
                  <Row xs={1} xl={2}>
                    <span>
                      <b>{DateFormatter.toDMYH(evolution.createdAt)}</b>
                      {" - "}
                      {evolution.user} actualizó el estado del diseño a{" "}
                      <i
                        className={`ms-2 ${
                          DesignStatuses[evolution.status].icon
                        }`}
                      ></i>
                      <b>{DesignStatuses[evolution.status].text}</b>
                    </span>
                    {evolution.comment && (
                      <p className="text-muted fst-italic mb-0 text-uppercase small">
                        <i className="bi bi-chat-right-text me-1"></i>{" "}
                        {evolution.comment}
                      </p>
                    )}
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
