import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { Data, Options } from "./components";
import { LoadingSpinner } from "../../components";
import { SweetAlert2 } from "../../utils";
import { ProjectDetailInterface } from "./interfaces";

export const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectDetailInterface>();

  const [formStatus, setFormStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/projects/${id}`);
      setProject(data.item);
      setFormStatus(data.item.status);
      setLoading(false);
    } catch (error) {
      return navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleDelete = async () => {
    try {
      const confirmation = await SweetAlert2.confirm(
        "¿Estás seguro de que quieres eliminar el proyecto?"
      );
      if (confirmation.isConfirmed) {
        await apiSJM.delete(`/projects/${id}`);
        navigate("/proyectos");
        SweetAlert2.successToast("¡Proyecto eliminado correctamente!");
      }
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  const handleUpdateStatus = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de que quieres actualizar el estado del proyecto?"
    );

    if (formStatus === "" || formStatus === project?.status) {
      return SweetAlert2.errorAlert(
        "Debes seleccionar un estado diferente al actual"
      );
    }

    if (confirmation.isConfirmed) {
      try {
        const { data } = await apiSJM.put(`/project/${id}/status`, {
          status: formStatus,
        });
        fetch();
        setShowModal(false);
        SweetAlert2.successToast(data.message);
        setFormStatus(project?.status || "");
      } catch (error: any) {
        SweetAlert2.errorAlert(error.response.data.message);
      }
    }
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      {!loading && project && (
        <>
          <Row>
            <Col lg={8}>
              <div className="d-flex gap-3 align-items-center mb-3">
                <Button
                  variant="light border text-muted"
                  size="sm"
                  onClick={() => navigate(`/proyectos`)}
                  title="Volver al listado de proyectos"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Atrás
                </Button>
                <h1 className="fs-5 my-0">Detalle de proyecto</h1>
              </div>
              <Data project={project} />
            </Col>
            <Col lg={4}>
                <Options id={project.id} />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};
