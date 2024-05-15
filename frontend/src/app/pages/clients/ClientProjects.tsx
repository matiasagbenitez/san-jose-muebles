import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";
import { Card, Col, Row } from "react-bootstrap";
import { SimplePageHeader, LoadingSpinner } from "../../components";

import { BasicClientInterface, ClientProjectInterface } from "./interfaces";
import { Statuses } from "../projects/interfaces";

export const ClientProjects = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<BasicClientInterface | null>(null);
  const [projects, setProjects] = useState<ClientProjectInterface[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/clients/${id}/projects`);
      setClient(data.client);
      setProjects(data.projects);
      setLoading(false);
    } catch (error) {
      console.error(error);
      navigate(`/clientes/${id}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {client && (
        <SimplePageHeader
          goBackTo={`/clientes/${id}`}
          goBackTitle="Volver al listado de clientes"
          title={`Listado de proyectos del cliente ${
            client.name + " " + client.last_name
          }`}
          hr
          className="mb-3"
        />
      )}

      {loading && <LoadingSpinner />}
      {projects.length === 0 && !loading && (
        <p className="text-muted text-center">
          <i className="bi bi-exclamation-circle me-2"></i>
          El cliente no tiene proyectos registrados
        </p>
      )}
      {projects.length > 0 && !loading && (
        <Row xs={1} md={2} xl={3} className="g-4">
          {projects.map((project, index) => (
            <Col key={index}>
              <Card>
                <Card.Img
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/proyectos/${project.id}`)}
                  variant="top"
                  src="https://placehold.co/300x200?text=Imagen+proyecto&font=roboto"
                  // src="https://picsum.photos/200?grayscale"
                />
                <Card.Body>
                  <Card.Title>
                    <h6 className="fw-bold">
                      {project.title || "Proyecto sin título"}
                    </h6>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    <small className="fst-italic">{project.locality}</small>
                  </Card.Subtitle>
                  <span
                    className="badge"
                    style={{
                      backgroundColor:
                        Statuses[project.status as keyof typeof Statuses],
                      color: "black",
                    }}
                  >
                    PROYECTO {project.status}
                  </span>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};
