import { Accordion, Button, Card } from "react-bootstrap";
import { DateFormatter } from "../../../helpers";
import { Task } from "../interfaces";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <Card className="my-2 small" key={task.id}>
      <Card.Header className="p-2">
        <div className="d-flex align-items-center justify-content-between">
          <Card.Subtitle className="text-center mb-0">
            <span className="badge rounded-pill bg-secondary"># {task.id}</span>
          </Card.Subtitle>
          <Button
            variant="transparent"
            size="sm"
            className="py-0 px-1"
            title="Actualizar tarea"
          >
            <i className="bi bi-three-dots"></i>
          </Button>
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
                Fecha creación {DateFormatter.toDMYH(task.createdAt)}
              </span>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
    </Card>
  );
};
