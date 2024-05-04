import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button, Modal } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { VisitRequestInterface } from "./interfaces";
import { VisitRequestInfo, VisitRequestOptions } from "./components";
import { LoadingSpinner } from "../../components";
import { SweetAlert2 } from "../../utils";
import { MySelect, MyTextArea } from "../../components/forms";
import { Form, Formik } from "formik";
import * as Yup from "yup";

interface InitialFormInterface {
  status: "PENDIENTE" | "PAUSADA" | "REALIZADA" | "CANCELADA";
  comment: string;
}

const initialForm: InitialFormInterface = {
  status: "PENDIENTE",
  comment: "",
};

export const VisitRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [visit, setVisit] = useState<VisitRequestInterface>();

  const [form, setForm] = useState(initialForm);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/visit_requests/${id}`);
      setVisit(data.item);
      setForm({ status: data.item.status, comment: data.item.comment });
      setLoading(false);
    } catch (error) {
      return navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleDelete = async () => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de que quieres eliminar esta solicitud de visita?"
    );
    if (!confirmation.isConfirmed) return;

    try {
      await apiSJM.delete(`/visit_requests/${id}`);
      navigate("/agenda");
      SweetAlert2.successToast("Solicitud eliminada correctamente");
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

  const handleSubmit = async (formData: any) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de que quieres actualizar el estado de la visita?"
    );
    if (!confirmation.isConfirmed) return;

    try {
      setIsFormSubmitted(true);
      const { data } = await apiSJM.put(`/visit_requests/${id}/status`, {
        formData,
      });
      fetch();
      setShowModal(false);
      SweetAlert2.successToast(data.message);
      setForm(initialForm);
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitted(false);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {visit && !loading && (
        <>
          <Row>
            <Col lg={9}>
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
                <h1 className="fs-5 my-0">Detalle de visita</h1>
              </div>
              <VisitRequestInfo visit={visit} />
            </Col>
            <Col lg={3}>
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
              <Formik
                initialValues={form}
                onSubmit={(values) => {
                  console.log(values);
                  handleSubmit(values);
                }}
                validationSchema={Yup.object({
                  status: Yup.string()
                    .required("El estado es requerido")
                    .test(
                      "is-different",
                      "El estado debe ser diferente al actual",
                      (value) => value !== visit.status
                    ),

                  comment: Yup.string()
                    .required("El comentario es requerido")
                    .min(5, "El comentario debe tener al menos 5 caracteres")
                    .max(
                      255,
                      "El comentario debe tener como máximo 255 caracteres"
                    ),
                })}
              >
                {({ errors, touched }) => (
                  <Form id="form">
                    <MySelect
                      label="Estado de la visita"
                      name="status"
                      as="select"
                      isInvalid={!!errors.status && touched.status}
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="PAUSADA">PAUSADA</option>
                      <option value="REALIZADA">REALIZADA</option>
                      <option value="CANCELADA">CANCELADA</option>
                    </MySelect>

                    <MyTextArea
                      label="Comentarios"
                      name="comment"
                      placeholder="Ingrese un comentario"
                      rows={4}
                      isInvalid={!!errors.comment && touched.comment}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      className="mt-3 float-end"
                      size="sm"
                      disabled={isFormSubmitted}
                    >
                      <i className="bi bi-floppy me-2"></i>
                      Guardar cambios
                    </Button>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};
