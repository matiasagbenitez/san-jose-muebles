import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { VisitRequestInterface } from "./interfaces";
import { VisitRequestInfo, VisitRequestOptions } from "./components";
import { LoadingSpinner } from "../../components";
import { SweetAlert2 } from "../../utils";

export const VisitRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [visit, setVisit] = useState<VisitRequestInterface>();

  const [formStatus, setFormStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/visit_requests/${id}`);
      setVisit(data.item);
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
        "¿Estás seguro de que quieres eliminar esta solicitud de visita?"
      );
      if (confirmation.isConfirmed) {
        await apiSJM.delete(`/visit_requests/${id}`);
        navigate("/agenda");
        SweetAlert2.successToast("Solicitud eliminada correctamente");
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
      "¿Estás seguro de que quieres actualizar el estado de la visita?"
    );

    if (formStatus === "" || formStatus === visit?.status) {
      return SweetAlert2.errorAlert(
        "Debes seleccionar un estado diferente al actual"
      );
    }

    if (confirmation.isConfirmed) {
      try {
        const { data } = await apiSJM.put(`/visit_requests/${id}/status`, { status: formStatus });
        fetch();
        setShowModal(false);
        SweetAlert2.successToast(data.message);
        setFormStatus(visit?.status || "");
      } catch (error: any) {
        SweetAlert2.errorAlert(error.response.data.message);
      }
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {visit && !loading && (
        <>
          <Row>
            <Col lg={8}>
              <div className="d-flex gap-3 align-items-center mb-3">
                <Button
                  variant="light border text-muted"
                  size="sm"
                  onClick={() => navigate(`/agenda`)}
                  title="Volver al listado de visitas"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Atrás
                </Button>
                <h1 className="fs-5 my-0">Solicitud de visita</h1>
              </div>
              <VisitRequestInfo visit={visit} />
            </Col>
            <Col lg={4}>
              <VisitRequestOptions
                id={visit.id}
                handleDelete={handleDelete}
                handleUpdateStatus={handleUpdateStatus}
              />
            </Col>
          </Row>

          <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Actualizar estado de la visita</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  controlId="status"
                  className="my-2 d-flex justify-content-between fw-bold"
                >
                  <Form.Check
                    inline
                    type="radio"
                    name="status"
                    label="PENDIENTE"
                    value="PENDIENTE"
                    checked={formStatus === "PENDIENTE"}
                    onChange={(e) => setFormStatus(e.target.value)}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    name="status"
                    label="REALIZADA"
                    value="REALIZADA"
                    checked={formStatus === "REALIZADA"}
                    onChange={(e) => setFormStatus(e.target.value)}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    name="status"
                    label="CANCELADA"
                    value="CANCELADA"
                    checked={formStatus === "CANCELADA"}
                    onChange={(e) => setFormStatus(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex mt-3 gap-2 justify-content-end">
                  <Button size="sm" variant="secondary" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button size="sm" variant="primary" type="submit">
                    Guardar cambios
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};
