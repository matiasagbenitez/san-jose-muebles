import { Col, Row } from "react-bootstrap";
import { ProjectBasicData, Statuses } from "../interfaces";

interface ProjectHeaderProps {
  project: ProjectBasicData;
  showStatus?: boolean;
}

export const ProjectHeader = ({ project, showStatus = true }: ProjectHeaderProps) => {
  return (
    <Row>
      <Col xs={12} lg={3}>
        <p className="text-muted">
          Cliente: <span className="fw-bold">{project.client}</span>
        </p>
      </Col>
      <Col xs={12} lg={showStatus ? 6 : 9}>
        <p className="text-muted">
          Proyecto:{" "}
          <span className="fw-bold">
            {project.title || "Sin título especificado"} ({project.locality})
          </span>
        </p>
      </Col>
      {showStatus && (
        <Col xs={12} lg={3}>
          <p className="text-muted">
            Estado proyecto:{" "}
            <span
              className="badge rounded-pill ms-1"
              style={{
                fontSize: ".9em",
                color: "black",
                backgroundColor: Statuses[project.status],
              }}
            >
              {project.status}
            </span>
          </p>
        </Col>
      )}
    </Row>
  );
};
