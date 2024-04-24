import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

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

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/visit_requests/${id}`);
      setVisit(data.item);
      console.log(data.item);
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

  return (
    <>
      {loading && <LoadingSpinner />}
      {visit && !loading && (
        <>
          <Row>
            <Col lg={6}>
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
            <Col lg={6}>
              <VisitRequestOptions id={visit.id} handleDelete={handleDelete} />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
