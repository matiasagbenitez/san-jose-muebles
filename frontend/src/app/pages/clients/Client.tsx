import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { ClientInterface } from "./interfaces";
import { ClientInfo, ClientsForm, ClientOptions } from "./components";
import { LoadingSpinner, SimplePageHeader } from "../../components";
import { SweetAlert2 } from "../../utils";

export const Client = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [client, setClient] = useState<ClientInterface>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/clients/${id}`);
      setClient(data.client);
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

  const handleSubmit = async (formData: ClientInterface) => {
    try {
      setIsFormSubmitting(true);
      const confirmation = await SweetAlert2.confirm(
        "¿Estás seguro de que quieres modificar este cliente?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.put(`/clients/${id}`, formData);
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
        "¿Estás seguro de que quieres eliminar este cliente?"
      );
      if (confirmation.isConfirmed) {
        await apiSJM.delete(`/clients/${id}`);
        navigate("/clientes");
        SweetAlert2.successToast("Cliente eliminado correctamente");
      }
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {client && !loading && (
        <>
          <SimplePageHeader
            goBackTo="/clientes"
            goBackTitle="Volver al listado de clientes"
            title={`${client.name} ${client.last_name}`}
          />
          <Row>
            <Col lg={8}>
              <ClientInfo client={client} />
            </Col>
            <Col lg={4}>
              <ClientOptions
                id={client.id}
                setIsModalOpen={setIsModalOpen}
                handleDelete={handleDelete}
              />
            </Col>
          </Row>

          <ClientsForm
            show={isModalOpen}
            onHide={handleHide}
            editMode={true}
            onSubmit={handleSubmit}
            initialForm={client}
            isFormSubmitting={isFormSubmitting}
            localities={[]}
          />
        </>
      )}
    </>
  );
};
