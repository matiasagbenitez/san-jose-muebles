import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Design, DesignTaskEvolution, DesignTaskInterface } from "./interfaces";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, SimplePageHeader } from "../../components";
import { ListGroup } from "react-bootstrap";
import { DateFormatter } from "../../helpers";
import { ProjectAccordion } from "./components";

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
          <ProjectAccordion design={design} />

          <div className="border rounded-3 p-3 my-3">
            <h5>
              Tarea N° {task.id} — <b className="text-muted">{task.title}</b>
            </h5>
            <p className="mb-0">
              Descripción:{" "}
              <span className="text-muted">
                {task.description || "Sin descripción"}
              </span>
            </p>
          </div>

          {evolutions.length === 0 ? (
            <div className="mt-3">
              <p className="text-muted fst-italic small">
                No se han registrado cambios de estado a esta tarea
              </p>
            </div>
          ) : (
            <ListGroup className="small">
              {evolutions.map((evolution) => (
                <ListGroup.Item key={evolution.id}>
                  <span>
                    <b className="small text-muted">
                      {DateFormatter.toDMYH(evolution.createdAt)}
                    </b>
                    {" — "}
                    {evolution.user} actualizó el estado de la tarea a{" "}
                    <b className="small text-muted">
                      <i className={options[evolution.status].icon}></i>
                      {options[evolution.status].text}
                    </b>
                  </span>
                </ListGroup.Item>
              ))}
              <ListGroup.Item key={task.id}>
                <span>
                  <b className="text-muted small">
                    {DateFormatter.toDMYH(task.createdAt)}
                  </b>
                  {" — "}
                  {task.user} creó la tarea{" "}
                  <b className="small text-muted">{task.title}</b>
                </span>
              </ListGroup.Item>
            </ListGroup>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};
