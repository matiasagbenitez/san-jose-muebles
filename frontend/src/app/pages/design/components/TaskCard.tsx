import { Accordion, Card, Dropdown } from "react-bootstrap";
import { DateFormatter } from "../../../helpers";
import { Task, DesignTaskStatusText, DesignTaskStatus } from "../interfaces";
interface TaskCardProps {
  task: Task;
  options: DesignTaskStatus[];
  handleUpdateStatus: (
    id_task: number,
    prev_status: string,
    status: string
  ) => void;
  handleDeleteTask: (id_task: number, status: string) => void;
  handleNavigateTaskHistorial: (id_task: number) => void;
}

export const TaskCard = ({
  task,
  options,
  handleUpdateStatus,
  handleDeleteTask,
  handleNavigateTaskHistorial,
}: TaskCardProps) => {
  return (
    <Card className="my-2 small" key={task.id}>
      <Card.Header className="p-2">
        <div className="d-flex align-items-center justify-content-between">
          <Card.Subtitle className="text-center mb-0">
            <span className="badge rounded-pill bg-secondary"># {task.id}</span>
          </Card.Subtitle>

          <Dropdown>
            <Dropdown.Toggle
              variant="transparent"
              className="py-0 px-2"
              id="dropdown-basic"
            >
              <small className="text-muted">Opciones</small>
            </Dropdown.Toggle>

            <Dropdown.Menu className="small">
              {options.map((option) => (
                <Dropdown.Item
                  className="small"
                  key={option}
                  onClick={() =>
                    handleUpdateStatus(+task.id, task.status, option)
                  }
                >
                  {DesignTaskStatusText[option]}
                </Dropdown.Item>
              ))}
              <Dropdown.Item
                key="delete"
                className="small"
                onClick={() => handleNavigateTaskHistorial(+task.id)}
              >
                <i className="bi bi-clock-history"></i> Ver historial
              </Dropdown.Item>
              <Dropdown.Item
                key="delete"
                className="small text-danger"
                onClick={() => handleDeleteTask(+task.id, task.status)}
              >
                <i className="bi bi-trash"></i> Eliminar tarea
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <Accordion className="small">
          <Accordion.Item eventKey="0" className="border-0 p-0">
            <Accordion.Button className="border-0 p-2">
              <b className="small">{task.title}</b>
            </Accordion.Button>
            <Accordion.Body className=" p-2">
              <p className="mb-2">{task.description}</p>
              <hr className="my-2" />
              <span className="text-muted fst-italic">
                Creado el {DateFormatter.toDMYH(task.createdAt)}
              </span>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
    </Card>
  );
};
