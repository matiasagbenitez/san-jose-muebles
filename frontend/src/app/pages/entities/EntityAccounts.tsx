import { useState, useEffect } from "react";
import { Button, Row, Col, Modal, Form, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, PageHeader } from "../../components";
import { SweetAlert2 } from "../../utils";
import { EntityAccountInterface, EntityBasicInfoInterface } from "./interfaces";
import { DateFormatter, NumberFormatter } from "../../helpers";

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
            <Table
              striped
              bordered
              responsive
              size="sm"
              className="small align-middle"
            >
              <thead>
                <tr className="text-uppercase text-center">
                  <th className="col-6">Moneda</th>
                  <th className="col-2">Saldo actual</th>
                  <th className="col-2">Último movimiento</th>
                  <th className="col-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td className="px-2">
                      CUENTA CORRIENTE EN <b>{account.currency.name}</b>
                    </td>
                    <td
                      className={`px-2 text-end fw-bold fs-6 text-${
                        account.balance < 0
                          ? "danger"
                          : account.balance == 0
                          ? "muted"
                          : "success"
                      } `}
                    >
                      {account.currency.symbol}{" "}
                      {NumberFormatter.formatSignedCurrency(
                        account.currency.is_monetary,
                        account.balance
                      )}
                    </td>
                    <td className="px-2 text-center">
                      {account.updatedAt &&
                        DateFormatter.toDMYH(account.updatedAt)}
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRedirectAccount(account.id)}
                          className="px-2 py-0"
                        >
                          <small>Ver cuenta</small>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
                    Cerrar
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
