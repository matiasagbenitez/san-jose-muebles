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
  useAccordionButton,
} from "react-bootstrap";
import { DateFormatter } from "../../helpers";

const pending = {
  text: "PENDIENTE",
  icon: "bi bi-clock-fill text-warning mx-1",
};
const inProcess = {
  text: "EN PROCESO",
  color: "primary",
  icon: "bi bi-play-circle-fill text-primary mx-1",
};
const finished = {
  text: "FINALIZADA",
  icon: "bi bi-check-circle-fill text-success mx-1",
};
const archived = {
  text: "ARCHIVADA",
  icon: "bi bi-archive-fill text-secondary mx-1",
};

const options: Record<string, { text: string; icon: string }> = {
  PENDIENTE: pending,
  PROCESO: inProcess,
  FINALIZADA: finished,
  ARCHIVADA: archived,
};

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

          <div className="border rounded-3 p-3 mb-3">
            <h5>Tarea #{task.id}</h5>
            <h6>
              Título: <span className="text-muted">{task.title}</span>
            </h6>
            <p>
              Descripción:{" "}
              <span className="text-muted">
                {task.description || "Sin descripción"}
              </span>
            </p>
            <small className="text-muted fst-italic">
              Tarea creada el {DateFormatter.toDMYH(task.createdAt)} por{" "}
              <b>{task.user}</b>
            </small>
          </div>

          {evolutions.length === 0 ? (
            <p className="text-muted fst-italic small">
              No se han registrado cambios de estado a esta tarea
            </p>
          ) : (
            <ListGroup className="small mb-3">
              {evolutions.map((evolution) => (
                <ListGroup.Item key={evolution.id}>
                  <span>
                    <b>{DateFormatter.toDMYH(evolution.createdAt)}</b>
                    {" - "}
                    {evolution.user} actualizó el estado de la tarea a{" "}
                    <b>
                      <i className={options[evolution.status].icon}></i>
                      {options[evolution.status].text}
                    </b>
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};
