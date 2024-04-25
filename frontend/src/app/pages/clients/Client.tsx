import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { ClientInterface } from "./interfaces";
import { ClientInfo, ClientsForm, ClientOptions } from "./components";
import { LoadingSpinner } from "../../components";
import { SweetAlert2 } from "../../utils";

export const Client = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [client, setClient] = useState<ClientInterface>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/clients/${id}`);
      console.log(data);
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
      const confirmation = await SweetAlert2.confirm(
        "¿Estás seguro de que quieres modificar este cliente?"
      );
      if (!confirmation.isConfirmed) return;
      setIsFormSubmitted(true);
      const { data } = await apiSJM.put(`/clients/${id}`, formData);
      SweetAlert2.successToast(data.message);
      setIsModalOpen(false);
      setIsFormSubmitted(false);
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
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
          <Row>
            <Col lg={8}>
              <div className="d-flex gap-3 align-items-center mb-3">
                <Button
                  variant="light border text-muted"
                  size="sm"
                  onClick={() => navigate(`/clientees`)}
                  title="Volver al listado de clientees"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Atrás
                </Button>
                {/* <h1 className="fs-5 my-0">Cliente #{client.id}: {client.name}</h1> */}
                <h1 className="fs-5 my-0">{client.name}</h1>
              </div>
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
            isFormSubmitted={isFormSubmitted}
          />
        </>
      )}
    </>
  );
};
