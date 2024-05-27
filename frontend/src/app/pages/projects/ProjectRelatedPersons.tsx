import { useState, useEffect } from "react";
import { Button, Card, Row, Col, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, PageHeader } from "../../components";
import { SweetAlert2 } from "../../utils";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MyTextInput } from "../../components/forms";

interface RelatedPerson {
  id: number;
  name: string;
  phone: string;
  relation: string;
  annotations: string;
}

const initialForm = {
  name: "",
  phone: "",
  relation: "",
  annotations: "",
};

export const ProjectRelatedPersons = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [persons, setPersons] = useState<RelatedPerson[] | []>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/related_persons/project/${id}`);
      console.log(data.items);
      setPersons(data.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      navigate(`/proyectos/${id}`);
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (person: RelatedPerson) => {
    setForm(person);
    setEditingId(person.id);
    handleOpenModal();
  };

  const handleSubmit = async (formData: any) => {
    try {
      setIsFormSubmitting(true);
      const confirmation = await SweetAlert2.confirm(
        "¿Está seguro que desea realizar esta acción?"
      );
      if (!confirmation.isConfirmed) return;
      if (editingId) {
        const { data } = await apiSJM.put(`/related_persons/${editingId}`, {
          ...formData,
          id_project: id,
        });
        SweetAlert2.successToast(data.message);
      } else {
        const { data } = await apiSJM.post("/related_persons", {
          ...formData,
          id_project: id,
        });
        SweetAlert2.successToast(data.message);
      }
      handleCloseModal();
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const confirmation = await SweetAlert2.confirm(
        "¿Está seguro que desea realizar esta acción?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.delete(`/related_persons/${id}`);
      SweetAlert2.successToast(data.message);
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && persons && (
        <>
          <PageHeader
            goBackTo={`/proyectos/${id}`}
            goBackTitle="Volver al detalle del proyecto"
            title="Personas relacionadas al proyecto"
            handleAction={handleOpenModal}
            actionButtonText="Nueva persona"
          />

          {persons.length === 0 ? (
            <p className="text-muted text-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              El proyecto no tiene personas relacionadas al proyecto registradas
            </p>
          ) : (
            <Row>
              {persons.map((person: RelatedPerson, index) => (
                <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                  <Card className="small" key={person.id}>
                    <Card.Header className="text-center fw-bold">
                      {person.name}
                    </Card.Header>
                    <Card.Body>
                      <p className="mb-1">
                        <b>Persona:</b> {person.name}
                      </p>
                      <p className="mb-1">
                        <b>Teléfono:</b> {person.phone}
                      </p>
                      <p className="mb-1">
                        <b>Relación/rol:</b> {person.relation}
                      </p>
                      <p className="mb-1">
                        <b>Observaciones:</b> {person.annotations}
                      </p>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-end gap-2">
                      <Button
                        variant="warning"
                        size="sm"
                        className="py-0 px-1"
                        onClick={() => handleEdit(person)}
                        title="Editar persona relacionada al proyecto"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="py-0 px-1"
                        onClick={() => handleDelete(person.id)}
                        title="Eliminar persona relacionada al proyecto"
                      >
                        <i className="bi bi-x-circle"></i>
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <div className="p-4">
          <h1 className="fs-5">
            {editingId
              ? "Modificar persona relacionada al proyecto"
              : "Crear persona relacionada al proyecto"}
          </h1>
          <hr className="my-2" />

          <Formik
            initialValues={form}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("El nombre es requerido"),
            })}
          >
            {({ errors, touched }) => (
              <Form id="form">
                <MyTextInput
                  label="Nombre de la persona"
                  name="name"
                  type="text"
                  placeholder="Ingrese el nombre de la persona"
                  isInvalid={!!errors.name && touched.name}
                  disabled={isFormSubmitting}
                />

                <MyTextInput
                  label="Teléfono"
                  name="phone"
                  type="text"
                  placeholder="Ingrese el teléfono de la persona"
                  isInvalid={!!errors.phone && touched.phone}
                  disabled={isFormSubmitting}
                />

                <MyTextInput
                  label="Relación"
                  name="relation"
                  type="text"
                  placeholder="Ej: esposo, esposa, hijo, hija, arquitecto, albañil, ingeniero, etc."
                  isInvalid={!!errors.relation && touched.relation}
                  disabled={isFormSubmitting}
                />

                <MyTextInput
                  label="Observaciones (opcional)"
                  name="annotations"
                  type="text"
                  placeholder="Ingrese observaciones sobre la persona"
                  isInvalid={!!errors.annotations && touched.annotations}
                  disabled={isFormSubmitting}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="mt-3 float-end"
                  size="sm"
                  disabled={isFormSubmitting}
                >
                  <i className="bi bi-floppy me-2"></i>
                  Guardar
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
};
