import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Row, Col, Modal, Form, ListGroup } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, PageHeader } from "../../components";
import { NumberFormatter } from "../../helpers";
import { SweetAlert2 } from "../../utils";

import { EntityAccountInterface, EntityBasicInfoInterface } from "./interfaces";

const initialForm = {
  id_currency: "",
};

export const EntityAccounts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState<EntityBasicInfoInterface>();
  const [accounts, setAccounts] = useState<EntityAccountInterface[]>([]);
  const [currencies, setCurrencies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        apiSJM.get(`/entity_accounts/entity/${id}`),
        apiSJM.get("/currencies/monetaries"),
      ]);
      setEntity(res1.data.entity);
      setAccounts(res1.data.accounts);
      setCurrencies(res2.data.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      navigate(`/entidades/${id}`);
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setForm(initialForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsFormSubmitting(true);
      const confirmation = await SweetAlert2.confirm(
        "¿Estás seguro de crear una nueva cuenta corriente?"
      );
      if (confirmation.isConfirmed) {
        const formData = { ...form, id_entity: id };
        const { data } = await apiSJM.post("/entity_accounts", formData);
        SweetAlert2.successToast(data.message || "¡Cuenta creada!");
        fetch();
        handleClose();
      }
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleRedirectAccount = (id_entity_account: number) => {
    navigate(`/entidades/${id}/cuentas/${id_entity_account}`);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && entity && accounts && (
        <>
          <PageHeader
            goBackTo={`/entidades/${id}`}
            goBackTitle="Volver a la entidad"
            title="Listado de cuentas corrientes"
            handleAction={handleCreate}
            actionButtonText="Nueva cuenta"
          />

          <Row>
            <Col xs={12} lg={6}>
              <p className="text-muted">
                Entidad: <span className="fw-bold">{entity.name}</span>
              </p>
            </Col>
            <Col xs={12} lg={6}>
              <p className="text-muted">
                Localidad: <span className="fw-bold">{entity.locality}</span>
              </p>
            </Col>
          </Row>

          {accounts.length === 0 ? (
            <p className="text-muted text-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              La entidad no tiene cuentas corrientes registradas
            </p>
          ) : (
            <>
              {accounts.map((account, index) => (
                <ListGroup key={index} horizontal="lg" className="mb-3 small">
                  <ListGroup.Item className="col-12 col-md-9 bg-light text-center text-md-start">
                    CUENTA CORRIENTE EN <b>{account.currency.name}</b>
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-md-2">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-bold text-muted">SALDO:</span>
                      <span
                        className={`mb-0 text-end fw-bold text-${
                          account.balance < 0
                            ? "danger"
                            : account.balance == 0
                            ? "muted"
                            : "success"
                        } `}
                      >
                        <span className="text-muted fw-normal">
                          {account.currency.symbol}
                        </span>{" "}
                        {NumberFormatter.formatSignedCurrency(
                          account.currency.is_monetary,
                          account.balance
                        )}
                      </span>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-md-1 p-0">
                    <Button
                      size="sm"
                      variant="light"
                      onClick={() => handleRedirectAccount(account.id)}
                      className="w-100 h-100 d-flex align-items-center justify-content-center"
                    >
                      <b>Ir a cuenta</b>
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              ))}
            </>
          )}

          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="fs-5">Crear cuenta corriente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <label className="form-label">Moneda de la cuenta</label>
                <Form.Select
                  name="id_currency"
                  size="sm"
                  required
                  onChange={(e) =>
                    setForm({ ...form, id_currency: e.target.value })
                  }
                  disabled={isFormSubmitting}
                >
                  <option value="">Seleccione una moneda</option>
                  {currencies.map((currency: any) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.name}
                    </option>
                  ))}
                </Form.Select>

                <div className="d-flex justify-content-end mt-3 gap-2">
                  <Button size="sm" variant="secondary">
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    disabled={isFormSubmitting}
                  >
                    <i className="bi bi-floppy me-2"></i>
                    Guardar
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
