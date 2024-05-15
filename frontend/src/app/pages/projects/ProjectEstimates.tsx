import { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, PageHeader } from "../../components";
// import { DateFormatter, NumberFormatter } from "../../helpers";

interface ProjectEstimateInterface {
  id: number;
  status: "VALIDO" | "ENVIADO" | "ACEPTADO" | "RECHAZADO" | "ANULADO";
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
  const [estimates, setEstimates] = useState<ProjectEstimateInterface[]>([]);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/estimates/by-project/${id}`);
      setEstimates(data.items);
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

          {estimates.length === 0 ? (
            <p className="text-muted text-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              El proyecto no tiene presupuestos asociados
            </p>
          ) : (
            <Row>
              {estimates.map((estimate, index) => (
                <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                  <Card className="text-center small">
                    <Card.Header>CUENTA CORRIENTE PROYECTO</Card.Header>
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
