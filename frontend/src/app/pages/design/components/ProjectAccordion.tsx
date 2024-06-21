import { Accordion } from "react-bootstrap";
import { DesignEntity } from "../interfaces";
// import "./styles.css";

interface Props {
  design: DesignEntity["design"];
}

export const ProjectAccordion = ({ design }: Props) => {
  return (
    <Accordion>
      <Accordion.Item className="p-0" eventKey="0">
        <Accordion.Header>
          <small>
            <i className="bi bi-pencil-square me-2"></i>
            <b className="me-3">INSTANCIA DE DISEÑO N° {design.id}</b>
            <span>{`${design.type} — ${design.project} — ${design.client}`}</span>
          </small>
        </Accordion.Header>
        <Accordion.Body className="small text-muted">
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
