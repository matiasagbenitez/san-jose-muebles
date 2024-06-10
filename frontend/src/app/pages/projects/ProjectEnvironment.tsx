import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, SimplePageHeader } from "../../components";
import { ProjectEnvironmentDetailInterface } from "./interfaces";
import { DesignIcon, FabricationIcon, InstallationIcon } from "../../icons";
import { DateFormatter } from "../../helpers";
import { DesignStatuses } from "../design/interfaces";

export const ProjectEnvironment = () => {
  const { id: id_project, id_environment } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [environment, setEnvironment] =
    useState<ProjectEnvironmentDetailInterface>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(
        `/environments/project/${id_project}/environment/${id_environment}`
      );
      setEnvironment(data.item);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, [id_project, id_environment]);

  const handleRedirectWhatsapp = () => {
    const formatedPhone = environment?.client_phone.replace(/[-\s]/g, "");
    window.open(`https://api.whatsapp.com/send?phone=54${formatedPhone}`);
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      {!loading && environment && (
        <>
          <SimplePageHeader
            title={`Detalle del ambiente ${environment.type}`}
            // hr
          />

          <Row className="mb-3 fst-normal small bg-light px-2 py-3 rounded rounded-3 mx-0 border">
            <Col xs={12} lg={6}>
              <p className="mb-2" title="Cliente">
                <i className="bi bi-person me-2 fst-normal fw-bold" />
                <Link
                  to={`/clientes/${environment.id_client}`}
                  target="_blank"
                  title="Ver cliente"
                >
                  {environment.client}
                </Link>
                <i className="text-muted">
                  {environment.client_phone && (
                    <>
                      <button
                        className="btn btn-link p-0 btn-sm text-decoration-none"
                        title="Ir a WhatsApp"
                        onClick={handleRedirectWhatsapp}
                      >
                        <i className="bi bi-whatsapp ms-2 text-success">
                          <span className="ms-1">Enviar un WhatsApp</span>
                        </i>
                      </button>
                    </>
                  )}
                </i>
              </p>
            </Col>
            <Col xs={12} lg={6}>
              <p className="mb-2" title="Proyecto">
                <i className="bi bi-houses me-2 fst-normal fw-bold" />
                <b>
                  {environment.type} - PROYECTO {environment.project}
                </b>
              </p>
            </Col>
            <Col xs={12} lg={6}>
              <p className="mb-2">
                <i className="bi bi-exclamation-circle me-2 fst-normal fw-bold" />
                Prioridad {environment.priority}
              </p>
            </Col>
            <Col xs={12} lg={6}>
              <p className="mb-2">
                <i className="bi bi-exclamation-circle me-2 fst-normal fw-bold" />
                Complejidad {environment.difficulty}
              </p>
            </Col>
            <Col xs={12} lg={6}>
              <p className="mb-2">
                <i className="bi bi-calendar me-2 fst-normal fw-bold" />
                Fecha entrega solicitada:{" "}
                {environment.req_deadline
                  ? DateFormatter.toWDMYText(environment.req_deadline)
                  : "no especificada"}
              </p>
            </Col>
            <Col xs={12} lg={6}>
              {" "}
              <p className="mb-2">
                <i className="bi bi-calendar-check me-2 fst-normal fw-bold" />
                Fecha entrega estimada:{" "}
                {environment.est_deadline
                  ? DateFormatter.toWDMYText(environment.est_deadline)
                  : "no especificada"}
              </p>
            </Col>
            <hr className="my-2" />
            <Col xs={12}>
              <p className="mb-0 text-muted" title="Proyecto">
                <i className="bi bi-info-circle me-2 fst-normal fw-bold" />
                {environment.description}
              </p>
            </Col>
          </Row>

          <h6>Gestionar etapas del proyecto</h6>
          <Row xs={1} lg={3} className="g-3">
            <Link
              title="Ver diseño"
              to={`/disenos/${environment.des_id}`}
              className="fw-bold text-center text-decoration-none"
            >
              <Card>
                <Card.Header>DISEÑO</Card.Header>
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-around gap-3 h-100">
                    <span>
                      <i
                        className={DesignStatuses[environment.des_status].icon}
                      />
                      {DesignStatuses[environment.des_status].text}
                    </span>
                    <DesignIcon size={60} />
                  </div>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted fw-normal">
                    Última actualización:{" "}
                    {DateFormatter.toDMYH(environment.des_last_update)}
                  </small>
                </Card.Footer>
              </Card>
            </Link>

            <Link
              title="Ver fabricación"
              to={`/fabricaciones/${environment.fab_id}`}
              className="fw-bold text-center text-decoration-none"
            >
              <Card>
                <Card.Header>FABRICACIÓN</Card.Header>
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-around gap-3 h-100">
                    {environment.fab_status}
                    <FabricationIcon size={60} />
                  </div>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted fw-normal">
                    Última actualización:{" "}
                    {DateFormatter.toDMYH(environment.fab_last_update)}
                  </small>
                </Card.Footer>
              </Card>
            </Link>

            <Link
              title="Ver instalación"
              to={`/instalaciones/${environment.ins_id}`}
              className="fw-bold text-center text-decoration-none"
            >
              <Card>
                <Card.Header>INSTALACIÓN</Card.Header>
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-around gap-3 h-100">
                    {environment.ins_status}
                    <InstallationIcon size={60} />
                  </div>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted fw-normal">
                    Última actualización:{" "}
                    {DateFormatter.toDMYH(environment.ins_last_update)}
                  </small>
                </Card.Footer>
              </Card>
            </Link>
          </Row>
        </>
      )}
    </div>
  );
};
