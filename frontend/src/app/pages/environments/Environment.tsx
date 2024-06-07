import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button, Table, Card } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import {
  DifficultyColor,
  EnvironmentDetailInterface,
  PriorityColor,
} from "./interfaces";
import { DesignIcon, FabricationIcon, InstallationIcon } from "../../icons";
import { DesignStatusBadge } from "./components";
import { DateFormatter } from "../../helpers";

export const Environment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [environment, setEnvironment] = useState<EnvironmentDetailInterface>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/environments/${id}`);
      setEnvironment(data.item);
      setLoading(false);
    } catch (error) {
      navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleRedirectWhatsapp = () => {
    const formatedPhone = environment?.client_phone.replace(/[-\s]/g, "");
    window.open(`https://api.whatsapp.com/send?phone=54${formatedPhone}`);
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      {!loading && environment && (
        <>
          <div className="my-3">
            <Row className="d-flex align-items-center">
              <Col md={3} lg={2} xxl={1}>
                <Button
                  variant="light border text-muted w-100"
                  size="sm"
                  onClick={() => navigate(-1)}
                  title="Atrás"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Atrás
                </Button>
              </Col>
              <Col md={9} lg={10} xxl={11}>
                <h1 className="fs-5 mb-0 mt-3 mt-md-0">
                  <span className="text-muted">{environment.client}: </span>
                  {environment.project} ({environment.type})
                </h1>
              </Col>
            </Row>
            <hr />
          </div>

          <Table
            striped
            bordered
            responsive
            size="sm"
            className="small align-middle text-uppercase"
          >
            <tbody>
              <tr>
                <td className="col-3 px-2 fw-bold">Cliente</td>
                <td className="col-9 px-2">
                  <Link
                    to={`/clientes/${environment.id_client}`}
                    target="_blank"
                    title="Ver cliente"
                  >
                    {environment.client}
                  </Link>{" "}
                  <i className="text-muted">
                    {environment.client_phone && (
                      <>
                        <button
                          className="btn btn-link p-0 btn-sm text-decoration-none"
                          title="Ir a WhatsApp"
                          onClick={handleRedirectWhatsapp}
                        >
                          <i className="bi bi-whatsapp ms-2 text-success">
                            <span className="ms-1">WhatsApp</span>
                          </i>
                        </button>
                      </>
                    )}
                  </i>
                </td>
              </tr>
              <tr>
                <td className="fw-bold px-2">Proyecto</td>
                <td className="px-2 fw-bold">{environment.project}</td>
              </tr>
              <tr>
                <td className="fw-bold px-2">Ambiente</td>
                <td className="px-2">{environment.type}</td>
              </tr>
              <tr>
                <td className="fw-bold px-2">Descripción ambiente</td>
                <td className="px-2">{environment.description}</td>
              </tr>
              <tr>
                <td className="fw-bold px-2">Prioridad y dificultad</td>
                <td className="px-2">
                  <span
                    className="badge rounded-pill me-1"
                    style={{
                      fontSize: ".9em",
                      color: "black",
                      backgroundColor: PriorityColor[environment.priority],
                    }}
                  >
                    Prioridad {environment.priority}
                  </span>
                  <span
                    className="badge rounded-pill"
                    style={{
                      fontSize: ".9em",
                      color: "black",
                      backgroundColor: DifficultyColor[environment.difficulty],
                    }}
                  >
                    Dificultad {environment.difficulty}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="fw-bold px-2">Fecha entrega solicitada</td>
                <td className="px-2">
                  {" "}
                  {environment.req_deadline
                    ? DateFormatter.toWDMYText(environment.req_deadline)
                    : "No especificada"}
                </td>
              </tr>
              <tr>
                <td className="fw-bold px-2">Fecha entrega estimada</td>
                <td className="px-2">
                  {" "}
                  {environment.est_deadline
                    ? DateFormatter.toWDMYText(environment.est_deadline)
                    : "No especificada"}
                </td>
              </tr>
            </tbody>
          </Table>

          <Row xs={1} lg={3} className="g-3">
            <Col>
              <Card>
                <Card.Header className="text-center fw-bold">
                  DISEÑO
                </Card.Header>
                <Card.Body className="text-center d-flex flex-column align-items-center gap-3">
                  <DesignIcon size={80} />
                  <DesignStatusBadge status={environment.des_status} />
                  <Link to={`/disenos/${environment.des_id}`}>Ir a diseño</Link>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Header className="text-center fw-bold">
                  FABRICACIÓN
                </Card.Header>
                <Card.Body className="text-center d-flex flex-column align-items-center gap-3">
                  <FabricationIcon size={80} />
                  <DesignStatusBadge status={environment.fab_status} />
                  <Link to={`/fabricaciones/${environment.fab_id}`}>
                    Ir a fabricación
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Header className="text-center fw-bold">
                  INSTALACIÓN
                </Card.Header>
                <Card.Body className="text-center d-flex flex-column align-items-center gap-3">
                  <InstallationIcon size={80} />
                  <DesignStatusBadge status={environment.ins_status} />
                  <Link to={`/instalaciones/${environment.ins_id}`}>
                    Ir a instalación
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};
