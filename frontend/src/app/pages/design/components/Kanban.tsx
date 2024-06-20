import { useParams, useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import apiSJM from "../../../../api/apiSJM";
import { SweetAlert2 } from "../../../utils";
import { NoTaskCard, TaskCard, TaskFormValues, TaskModal } from ".";
import { Task } from "../interfaces";

export interface ActionCardOptions {
  text: string;
  action: string;
  icon: JSX.Element;
}

const pending: ActionCardOptions = {
  text: "PENDIENTE",
  action: "PENDIENTE",
  icon: <i className="bi bi-clock-fill text-warning me-2"></i>,
};
const process: ActionCardOptions = {
  text: "PROCESO",
  action: "EN PROCESO",
  icon: <i className="bi bi-play-circle-fill text-primary me-2"></i>,
};
const finished: ActionCardOptions = {
  text: "FINALIZADA",
  action: "FINALIZAR",
  icon: <i className="bi bi-check-circle-fill text-success me-2"></i>,
};
const archived: ActionCardOptions = {
  text: "ARCHIVADA",
  action: "ARCHIVAR",
  icon: <i className="bi bi-archive-fill text-secondary me-2"></i>,
};

const pendingOptions: ActionCardOptions[] = [process, finished, archived];
const processOptions: ActionCardOptions[] = [pending, finished, archived];
const finishedOptions: ActionCardOptions[] = [pending, process, archived];
const archivedOptions: ActionCardOptions[] = [pending, process, finished];

interface Props {
  tasks: {
    pending_tasks: Task[];
    process_tasks: Task[];
    finished_tasks: Task[];
    archived_tasks: Task[];
  };
}

export const Kanban = ({ tasks }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [processTasks, setProcessTasks] = useState<Task[]>([]);
  const [finishedTasks, setFinishedTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setPendingTasks(tasks.pending_tasks);
    setProcessTasks(tasks.process_tasks);
    setFinishedTasks(tasks.finished_tasks);
    setArchivedTasks(tasks.archived_tasks);
    setLoading(false);
  }, [tasks]);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleSubmit = async (values: TaskFormValues) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de crear la tarea?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      setIsFormSubmitted(true);
      const { data } = await apiSJM.post(`/design_tasks/design/${id}`, {
        ...values,
      });
      setPendingTasks([...pendingTasks, data.task]);
      setShowModal(false);
      SweetAlert2.successToast("¡Tarea creada exitosamente!");
    } catch (error) {
      console.log("Error creating task:", error);
      SweetAlert2.errorAlert("Error creando la tarea");
    } finally {
      setIsFormSubmitted(false);
    }
  };

  const handleUpdateStatus = async (
    id_task: number,
    prev_status: string,
    status: string
  ) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de actualizar el estado de la tarea?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      const { data } = await apiSJM.patch<{ task: Task }>(
        `/design_tasks/task/${id_task}/status`,
        {
          status,
        }
      );

      const { task } = data;

      switch (prev_status) {
        case "PENDIENTE":
          setPendingTasks(
            pendingTasks.filter((task) => task.id != id_task.toString())
          );
          break;
        case "PROCESO":
          setProcessTasks(
            processTasks.filter((task) => task.id != id_task.toString())
          );
          break;
        case "FINALIZADA":
          setFinishedTasks(
            finishedTasks.filter((task) => task.id != id_task.toString())
          );
          break;
        case "ARCHIVADA":
          setArchivedTasks(
            archivedTasks.filter((task) => task.id != id_task.toString())
          );
          break;
        default:
          break;
      }

      switch (task.status) {
        case "PENDIENTE":
          setPendingTasks([...pendingTasks, data.task]);
          break;
        case "PROCESO":
          setProcessTasks([...processTasks, data.task]);
          break;
        case "FINALIZADA":
          setFinishedTasks([...finishedTasks, data.task]);
          break;
        case "ARCHIVADA":
          setArchivedTasks([...archivedTasks, data.task]);
          break;
        default:
          break;
      }

      SweetAlert2.successToast("¡Estado actualizado exitosamente!");
    } catch (error) {
      console.log("Error updating task status:", error);
      SweetAlert2.errorAlert("Error actualizando el estado de la tarea");
    }
  };

  const deleteTask = async (id_task: number, status: string) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de eliminar la tarea?"
    );
    if (!confirmation.isConfirmed) return;

    try {
      await apiSJM.delete<{ task: Task }>(
        `/design_tasks/design/${id}/task/${id_task}`
      );

      switch (status) {
        case "PENDIENTE":
          setPendingTasks(
            pendingTasks.filter((task) => task.id != id_task.toString())
          );
          break;
        case "PROCESO":
          setProcessTasks(
            processTasks.filter((task) => task.id != id_task.toString())
          );
          break;
        case "FINALIZADA":
          setFinishedTasks(
            finishedTasks.filter((task) => task.id != id_task.toString())
          );
          break;
        case "ARCHIVADA":
          setArchivedTasks(
            archivedTasks.filter((task) => task.id != id_task.toString())
          );
          break;
        default:
          break;
      }
      SweetAlert2.successToast("¡Tarea eliminada exitosamente!");
    } catch (error) {
      console.log("Error deleting task:", error);
      SweetAlert2.errorAlert("Error eliminando la tarea");
    }
  };

  const handleNavigateTaskHistorial = (id_task: number) => {
    navigate(`/disenos/${id}/tarea/${id_task}/historial`);
  };

  return (
    <Fragment>
      <div className="d-flex align-items-center my-2 gap-2">
        <h6 className="mb-0">Tablero de tareas</h6>
        <Button
          variant="transparent"
          size="sm"
          className="align-self-start mx-2 py-1 text-muted"
          onClick={handleShowModal}
        >
          <i className="bi bi-plus-circle"></i> Nueva tarea
        </Button>
      </div>
      {!loading && (
        <div
          className="d-flex overflow-auto kanban-container mb-3"
          style={{ height: "calc(100vh - 260px)" }}
        >
          <div className="kanban-column border">
            <div className="kanban-header bg-light small">
              <i className="bi bi-clock-fill me-2 text-warning"></i>
              PENDIENTES
            </div>
            <div className="kanban-content">
              {pendingTasks.length === 0 && <NoTaskCard text="pendientes" />}
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  options={pendingOptions}
                  handleUpdateStatus={handleUpdateStatus}
                  handleDeleteTask={deleteTask}
                  handleNavigateTaskHistorial={handleNavigateTaskHistorial}
                />
              ))}
            </div>
          </div>
          <div className="kanban-column border">
            <div className="kanban-header bg-light small">
              <i className="bi bi-play-circle-fill me-2 text-primary"></i>
              EN PROCESO
            </div>
            <div className="kanban-content">
              {processTasks.length === 0 && <NoTaskCard text="en proceso" />}
              {processTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  options={processOptions}
                  handleUpdateStatus={handleUpdateStatus}
                  handleDeleteTask={deleteTask}
                  handleNavigateTaskHistorial={handleNavigateTaskHistorial}
                />
              ))}
            </div>
          </div>
          <div className="kanban-column border">
            <div className="kanban-header bg-light small">
              <i className="bi bi-check-circle-fill me-2 text-success"></i>
              FINALIZADAS
            </div>
            <div className="kanban-content">
              {finishedTasks.length === 0 && <NoTaskCard text="finalizadas" />}
              {finishedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  options={finishedOptions}
                  handleUpdateStatus={handleUpdateStatus}
                  handleDeleteTask={deleteTask}
                  handleNavigateTaskHistorial={handleNavigateTaskHistorial}
                />
              ))}
            </div>
          </div>

          <div className="kanban-column border">
            <div className="kanban-header bg-light small">
              <i className="bi bi-archive-fill me-2 text-secondary"></i>
              ARCHIVADAS
            </div>
            <div className="kanban-content">
              {archivedTasks.length === 0 && <NoTaskCard text="archivadas" />}
              {archivedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  options={archivedOptions}
                  handleUpdateStatus={handleUpdateStatus}
                  handleDeleteTask={deleteTask}
                  handleNavigateTaskHistorial={handleNavigateTaskHistorial}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <TaskModal
        showModal={showModal}
        hideModal={() => setShowModal(false)}
        handleSubmit={handleSubmit}
        isFormSubmitted={isFormSubmitted}
      />
    </Fragment>
  );
};
