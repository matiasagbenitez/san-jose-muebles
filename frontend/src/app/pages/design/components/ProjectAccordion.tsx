import { Accordion } from "react-bootstrap";
import { Design } from "../interfaces";
// import "./styles.css";

interface Props {
  design: Design;
}

export const ProjectAccordion = ({ design }: Props) => {
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div className="d-flex flex-column flex-lg-row small gap-3">
            <span>
              <i className="bi bi-pencil-square me-2"></i>
              <b>INSTANCIA DE DISEÑO N° {design.id}</b>
            </span>
            <span>
              {`${design.type} — ${design.project} — ${design.client}`}
            </span>
          </div>
        </Accordion.Header>
        <Accordion.Body className="text-muted" style={{ fontSize: "15px" }}>
          <small>
            <i className="bi bi-info-circle me-1"></i>
            <b className="me-1">DESCRIPCIÓN DEL AMBIENTE:</b>
            {design.description}
          </small>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
