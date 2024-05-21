import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { EntityInterface } from "./interfaces";
import { Info, EntitiesForm, Options } from "./components";
import { LoadingSpinner, SimplePageHeader } from "../../components";
import { SweetAlert2 } from "../../utils";

export const Entity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [entity, setEntity] = useState<EntityInterface>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/entities/${id}`);
      setEntity(data.item);
      setLoading(false);
    } catch (error) {
      return navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleHide = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData: EntityInterface) => {
    try {
      setIsFormSubmitting(true);
      const confirmation = await SweetAlert2.confirm(
        "¿Estás seguro de que quieres modificar esta entidad?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.put(`/entities/${id}`, formData);
      SweetAlert2.successToast(data.message);
      setIsModalOpen(false);
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const confirmation = await SweetAlert2.confirm(
        "¿Estás seguro de que quieres eliminar esta entidad?"
      );
      if (confirmation.isConfirmed) {
        await apiSJM.delete(`/entities/${id}`);
        navigate("/entidades");
        SweetAlert2.successToast("¡Entidad eliminada con éxito!");
      }
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {entity && !loading && (
        <>
          <SimplePageHeader
            goBackTo="/entidades"
            goBackTitle="Volver al listado de entidades"
            title={`${entity.name}`}
          />
          <Row>
            <Col lg={8}>
              <Info entity={entity} />
            </Col>
            <Col lg={4}>
              <Options
                id={entity.id}
                setIsModalOpen={setIsModalOpen}
                handleDelete={handleDelete}
              />
            </Col>
          </Row>

          <EntitiesForm
            show={isModalOpen}
            onHide={handleHide}
            editMode={true}
            onSubmit={handleSubmit}
            initialForm={entity}
            isFormSubmitting={isFormSubmitting}
            localities={[]}
          />
        </>
      )}
    </>
  );
};
