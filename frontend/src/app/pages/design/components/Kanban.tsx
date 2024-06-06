import { Fragment, useEffect, useState } from "react";
import { StatusColor } from "../../environments/interfaces";
import { Task } from "../interfaces";
import { NoTaskCard, TaskCard, TaskFormValues, TaskModal } from ".";
import { Button } from "react-bootstrap";
import { SweetAlert2 } from "../../../utils";
import apiSJM from "../../../../api/apiSJM";
import { useParams } from "react-router-dom";

interface Props {
  tasks: {
    pending_tasks: Task[];
    process_tasks: Task[];
    finished_tasks: Task[];
    canceled_tasks: Task[];
  };
}

export const Kanban = ({ tasks }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [processTasks, setProcessTasks] = useState<Task[]>([]);
  const [finishedTasks, setFinishedTasks] = useState<Task[]>([]);
  const [canceledTasks, setCanceledTasks] = useState<Task[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setPendingTasks(tasks.pending_tasks);
    setProcessTasks(tasks.process_tasks);
    setFinishedTasks(tasks.finished_tasks);
    setCanceledTasks(tasks.canceled_tasks);
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
        case "FINALIZADO":
          setFinishedTasks(
            finishedTasks.filter((task) => task.id != id_task.toString())
          );
          break;
        case "CANCELADO":
          setCanceledTasks(
            canceledTasks.filter((task) => task.id != id_task.toString())
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
        case "FINALIZADO":
          setFinishedTasks([...finishedTasks, data.task]);
          break;
        case "CANCELADO":
          setCanceledTasks([...canceledTasks, data.task]);
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

      const updateTaskList = (
        tasks: Task[],
        taskId: number,
        newTask?: Task
      ): Task[] => {
        return tasks
          .filter((task) => task.id !== taskId.toString())
          .concat(newTask ? [newTask] : []);
      };

      const taskLists = {
        PENDIENTE: setPendingTasks,
        PROCESO: setProcessTasks,
        FINALIZADO: setFinishedTasks,
        CANCELADO: setCanceledTasks,
      };

      if (taskLists[status as keyof typeof taskLists]) {
        taskLists[status as keyof typeof taskLists](
          updateTaskList(pendingTasks, id_task)
        );
      }

      SweetAlert2.successToast("¡Tarea eliminada exitosamente!");
    } catch (error) {
      console.log("Error deleting task:", error);
      SweetAlert2.errorAlert("Error eliminando la tarea");
    }
  };

  return (
    <Fragment>
      <div className="d-flex align-items-center">
        <h6>
          Tablero de tareas
          <Button
            variant="transparent"
            size="sm"
            className="align-self-start mx-2 py-0 text-muted"
            onClick={handleShowModal}
          >
            <i className="bi bi-plus-circle"></i> Nueva tarea
          </Button>
        </h6>
      </div>
      {!loading && (
        <div
          className="d-flex overflow-auto kanban-container"
          style={{ height: "calc(100vh - 250px)" }}
        >
          <div className="kanban-column border">
            <div className="kanban-header bg-light bg-light">
              <i className="bi bi-clock-fill me-2 text-warning"></i>
              PENDIENTES
            </div>
            <div className="kanban-content">
              {pendingTasks.length === 0 && <NoTaskCard text="pendientes" />}
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  options={["PROCESO", "FINALIZADO", "CANCELADO"]}
                  handleUpdateStatus={handleUpdateStatus}
                  handleDeleteTask={deleteTask}
                />
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
              {processTasks.length === 0 && <NoTaskCard text="en proceso" />}
              {processTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  options={["PENDIENTE", "FINALIZADO", "CANCELADO"]}
                  handleUpdateStatus={handleUpdateStatus}
                  handleDeleteTask={deleteTask}
                />
              ))}
            </div>
          </div>
          <div className="kanban-column border">
            <div className="kanban-header bg-light">
              <i className="bi bi-check-circle-fill me-2 text-success"></i>
              FINALIZADAS
            </div>
            <div className="kanban-content">
              {finishedTasks.length === 0 && <NoTaskCard text="finalizadas" />}
              {finishedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  options={["PENDIENTE", "PROCESO", "CANCELADO"]}
                  handleUpdateStatus={handleUpdateStatus}
                  handleDeleteTask={deleteTask}
                />
              ))}
            </div>
          </div>

          <div className="kanban-column border">
            <div className="kanban-header bg-light">
              <i className="bi bi-archive-fill me-2 text-secondary"></i>
              ARCHIVADAS
            </div>
            <div className="kanban-content">
              {canceledTasks.length === 0 && <NoTaskCard text="archivadas" />}
              {canceledTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  options={["PENDIENTE", "PROCESO", "FINALIZADO"]}
                  handleUpdateStatus={handleUpdateStatus}
                  handleDeleteTask={deleteTask}
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
