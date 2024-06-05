import { Fragment } from "react";
import { StatusColor } from "../../environments/interfaces";
import { Task } from "../interfaces";
import { NoTaskCard, TaskCard } from ".";

interface Props {
  tasks: {
    pending_tasks: Task[];
    process_tasks: Task[];
    finished_tasks: Task[];
    canceled_tasks: Task[];
  };
}

export const Kanban = ({ tasks }: Props) => {
  return (
    <Fragment>
      <h6>Tablero de tareas</h6>
      <div
        className=" d-flex overflow-auto kanban-container"
        style={{ height: "calc(100vh - 250px)" }}
      >
        <div className="kanban-column border">
          <div className="kanban-header bg-light bg-light">
            <i className="bi bi-clock-fill me-2 text-warning"></i>
            PENDIENTES
          </div>
          <div className="kanban-content">
            {tasks.pending_tasks.length === 0 && (
              <NoTaskCard text="pendientes" />
            )}
            {tasks.pending_tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        <div className="kanban-column border">
          <div className="kanban-header bg-light">
            <i
              className="bi bi-play-circle-fill me-2"
              style={{ color: StatusColor.PROCESO }}
            ></i>
            EN PROCESO
          </div>
          <div className="kanban-content">
            {tasks.process_tasks.length === 0 && (
              <NoTaskCard text="en proceso" />
            )}
            {tasks.process_tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        <div className="kanban-column border">
          <div className="kanban-header bg-light">
            <i className="bi bi-check-circle-fill me-2 text-success"></i>
            FINALIZADAS
          </div>
          <div className="kanban-content">
            {tasks.finished_tasks.length === 0 && (
              <NoTaskCard text="finalizadas" />
            )}
            {tasks.finished_tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="kanban-column border">
          <div className="kanban-header bg-light">
            <i className="bi bi-archive-fill me-2 text-secondary"></i>
            ARCHIVADAS
          </div>
          <div className="kanban-content">
            {tasks.canceled_tasks.length === 0 && (
              <NoTaskCard text="archivadas" />
            )}
            {tasks.canceled_tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
