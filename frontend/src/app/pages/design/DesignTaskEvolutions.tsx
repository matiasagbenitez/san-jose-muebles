import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Design, DesignTaskEvolution, DesignTaskInterface } from "./interfaces";
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

enum DesignTaskStatus {
  PENDIENTE = "PENDIENTE",
  PROCESO = "EN PROCESO",
  FINALIZADO = "FINALIZADA",
  CANCELADO = "ARCHIVADA",
}

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

export const DesignTaskEvolutions = () => {
  const navigate = useNavigate();
  const { id, id_task } = useParams<{ id: string; id_task: string }>();

  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState<Design | null>(null);
  const [task, setTask] = useState<DesignTaskInterface | null>(null);
  const [evolutions, setEvolutions] = useState<DesignTaskEvolution[]>([]);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(
        `/designs/${id}/task/${id_task}/evolutions`
      );
      setDesign(data.design);
      setTask(data.task);
      setEvolutions(data.task.evolutions);
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
      {!loading && id && design && task && evolutions && (
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

          <h5>
            Tarea:{" "}
            <span className="text-muted">
              {task.title}
            </span>
          </h5>
          <h6>
            Descripción:{" "}
            <span className="text-muted">
              {task.description}
            </span>
          </h6>
          <p className="small">
            Tarea creada el{" "}
            { DateFormatter.toDMYH(task.createdAt)} por{" "}
            <b>{task.user}</b>
          </p>

          {evolutions.length === 0 ? (
            <p className="text-muted fst-italic small">
              No se han registrado cambios de estado a esta tarea
            </p>
          ) : (
            <ListGroup className="small mb-3">
              {evolutions.map((evolution) => (
                <ListGroup.Item key={evolution.id}>
                  <Row xs={1} xl={2}>
                    <span>
                      <b>{DateFormatter.toDMYH(evolution.createdAt)}</b>
                      {" - "}
                      {evolution.user} actualizó el estado de la tarea a{" "}
                      <b>
                        {DesignTaskStatus[evolution.status as keyof typeof DesignTaskStatus]}
                      </b>
                    </span>
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
