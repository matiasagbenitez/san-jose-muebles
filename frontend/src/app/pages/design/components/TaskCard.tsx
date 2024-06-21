import { Accordion, Card, Dropdown } from "react-bootstrap";
import { Task } from "../interfaces";
import { ActionCardOptions } from ".";
import "./styles.css";
interface TaskCardProps {
  task: Task;
  options: ActionCardOptions[];
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
      <Card.Header className="px-2 py-1">
        <div className="d-flex align-items-center justify-content-between">
          <span>
            <i className="bi bi-tag me-1"></i>
            {task.id}
          </span>
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              variant="transparent"
              className="py-0 px-2 custom-dropdown-toggle"
              title="Opciones de la tarea"
            >
              {/* <i className="bi bi-three-dots"></i> */}
            </Dropdown.Toggle>

            <Dropdown.Menu className="small">
              {options.map((option) => (
                <Dropdown.Item
                  className="small"
                  key={option.action}
                  onClick={() =>
                    handleUpdateStatus(+task.id, task.status, option.text)
                  }
                >
                  {option.icon}
                  {option.text}
                </Dropdown.Item>
              ))}
              <Dropdown.Item
                key="historial"
                className="small"
                onClick={() => handleNavigateTaskHistorial(+task.id)}
              >
                <i className="bi bi-clock-history me-1"></i> Ver historial
              </Dropdown.Item>
              <Dropdown.Item
                key="delete"
                className="small text-danger"
                onClick={() => handleDeleteTask(+task.id, task.status)}
              >
                <i className="bi bi-trash me-1"></i> Eliminar tarea
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <Accordion>
          <Accordion.Item eventKey="0" className="border-0 p-0">
            <Accordion.Button className="border-0 p-2 custom-accordion-button">
              <p
                className="lh-sm fw-bold mb-0 text-break"
                style={{ fontSize: "12px" }}
              >
                {task.title}
              </p>
            </Accordion.Button>
            <Accordion.Body className=" p-2">
              {task.description ? (
                <>
                  <p className="mb-2" style={{ fontSize: "12px" }}>
                    {task.description}
                  </p>
                </>
              ) : (
                <span className="text-muted" style={{ fontSize: "12px" }}>
                  Sin descripción
                </span>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
    </Card>
  );
};
