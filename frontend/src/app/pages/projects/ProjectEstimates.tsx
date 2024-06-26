import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";
import { Card, Row, Col, Button } from "react-bootstrap";
import { LoadingSpinner, PageHeader } from "../../components";
import { DateFormatter, NumberFormatter } from "../../helpers";
import {
  EstimateStatuses,
  EstimateStatusesText,
  ProyectBasicData,
} from "./interfaces";
import { ProjectHeader } from "./components";

interface ProjectEstimateInterface {
  id: number;
  title: string;
  description: string;
  status: "NO_ENVIADO" | "ENVIADO" | "ACEPTADO" | "RECHAZADO";
  created_at: Date;
  currency: {
    name: string;
    symbol: string;
    is_monetary: boolean;
  };
  total: number;
}

export const ProjectEstimates = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<ProyectBasicData>();
  const [estimates, setEstimates] = useState<ProjectEstimateInterface[]>([]);

  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        apiSJM.get(`/estimates/by-project/${id}`),
        apiSJM.get(`/projects/${id}/basic`),
      ]);
      setEstimates(res1.data.items);
      setProject(res2.data.item);
      setLoading(false);
    } catch (error) {
      console.error(error);
      navigate(`/proyectos/${id}`);
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const createNewEstimate = () => {
    navigate(`/proyectos/${id}/presupuestos/nuevo`);
  };

  const handleRedirectDetail = (id_estimate: number) => {
    navigate(`/proyectos/${id}/presupuestos/${id_estimate}`);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <PageHeader
            goBackTo={`/proyectos/${id}`}
            goBackTitle="Volver al proyecto"
            title="Listado de presupuestos del proyecto"
            handleAction={createNewEstimate}
            actionButtonText="Nuevo presupuesto"
          />

          {project && <ProjectHeader project={project} showStatus={false} />}

          {estimates.length === 0 ? (
            <p className="text-muted text-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              El proyecto no tiene presupuestos asociados
            </p>
          ) : (
            <Row>
              {estimates.map((estimate, index) => (
                <Col key={index} xs={12} md={6} className="mb-3">
                  <Card className="small">
                    <Card.Header className="text-center">
                      PRESUPUESTO N° {estimate.id}
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col xs={12} className="mb-2">
                          <span>
                            Estado de aprobación:{" "}
                            <span
                              className="badge rounded-pill ms-1"
                              style={{
                                fontSize: ".9em",
                                color: "black",
                                backgroundColor:
                                  EstimateStatuses[estimate.status],
                              }}
                            >
                              {EstimateStatusesText[estimate.status]}
                            </span>
                          </span>
                        </Col>
                        <Col xs={12} className="mb-2">
                          <span>
                            Título del presupuesto:{" "}
                            <span className="fw-bold">{estimate.title}</span>
                          </span>
                        </Col>
                        <Col xs={12} className="mb-2">
                          <span>
                            Moneda del presupuesto:{" "}
                            <span className="fw-bold">
                              {estimate.currency.name}
                            </span>
                          </span>
                        </Col>
                        <Col xs={12}>
                          <span>
                            Total presupuesto:{" "}
                            {estimate.total > 0 ? (
                              <span className="text-muted fw-bold">
                                {estimate.currency.symbol}{" "}
                                {NumberFormatter.formatNotsignedCurrency(
                                  estimate.currency.is_monetary,
                                  estimate.total
                                )}
                              </span>
                            ) : (
                              <span className="text-muted fs-6 fw-bold">
                                Sin monto especificado
                              </span>
                            )}
                          </span>
                        </Col>
                      </Row>
                    </Card.Body>
                    <Card.Footer>
                      <div className="d-flex align-items-center justify-content-between">
                        <small className="text-muted">
                          <i className="bi bi-clock me-2"></i>
                          {DateFormatter.toDMYH(estimate.created_at)}
                        </small>
                        <Button
                          size="sm"
                          variant="secondary"
                          title="Ver presupuesto"
                          onClick={() => handleRedirectDetail(estimate.id)}
                        >
                          <i className="bi bi-eye-fill me-2"></i>
                          <small className="fw-bold">Ver presupuesto</small>
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </>
  );
};
