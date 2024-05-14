import { useState, useEffect } from "react";
import { Button, Card, Row, Col, Modal, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, PageHeader } from "../../components";
import { SweetAlert2 } from "../../utils";
import { ProjectAccountsData, ProjectBasicData, Statuses } from "./interfaces";
import { DateFormatter, NumberFormatter } from "../../helpers";

const initialForm = {
  id_currency: "",
};

export const ProjectAccounts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<ProjectBasicData>();
  const [accounts, setAccounts] = useState<ProjectAccountsData[]>([]);
  const [currencies, setCurrencies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        apiSJM.get(`/project_accounts/project/${id}`),
        apiSJM.get("/currencies"),
      ]);
      setProject(res1.data.project);
      setAccounts(res1.data.accounts);
      setCurrencies(res2.data.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      navigate(`/proyectos/${id}`);
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
        const formData = { ...form, id_project: id };
        const { data } = await apiSJM.post("/project_accounts", formData);
        SweetAlert2.successToast(data.message || "¡Cuenta creada!");
        setAccounts([...accounts, data.account]);
        handleClose();
      }
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleRedirectAccount = (id_project_account: number) => {
    navigate(`/proyectos/${id}/cuentas/${id_project_account}`);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && project && accounts && (
        <>
          <PageHeader
            goBackTo={`/proyectos/${id}`}
            goBackTitle="Volver al proyecto"
            title="Listado de cuentas corrientes"
            handleAction={handleCreate}
            actionButtonText="Nueva cuenta"
          />

          <Row>
            <Col xs={12} lg={3}>
              <p className="text-muted">
                Cliente: <span className="fw-bold">{project.client}</span>
              </p>
            </Col>
            <Col xs={12} lg={6}>
              <p className="text-muted">
                Proyecto:{" "}
                <span className="fw-bold">
                  {project.title || "Sin título especificado"} (
                  {project.locality})
                </span>
              </p>
            </Col>
            <Col xs={12} lg={3}>
              <p className="text-muted">
                Estado proyecto:{" "}
                <span
                  className="badge rounded-pill ms-1"
                  style={{
                    fontSize: ".9em",
                    color: "black",
                    backgroundColor: Statuses[project.status],
                  }}
                >
                  {project.status}
                </span>
              </p>
            </Col>
          </Row>

          {accounts.length === 0 ? (
            <p className="text-muted text-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              El proyecto no tiene cuentas corrientes registradas
            </p>
          ) : (
            <Row>
              {accounts.map(
                (
                  { id, balance, currency, updatedAt }: ProjectAccountsData,
                  index
                ) => (
                  <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                    <Card className="text-center small">
                      <Card.Header>CUENTA CORRIENTE PROYECTO</Card.Header>
                      <Card.Body>
                        <Card.Title>
                          {currency.name} ({currency.symbol})
                        </Card.Title>
                        <Card.Subtitle
                          className={`my-3 text-${
                            balance < 0
                              ? "danger"
                              : balance == 0
                              ? "muted"
                              : "success"
                          }`}
                        >
                          <span>{currency.symbol} </span>
                          <span>
                            {NumberFormatter.formatSignedCurrency(
                              currency.is_monetary,
                              balance
                            )}
                          </span>
                        </Card.Subtitle>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleRedirectAccount(id)}
                        >
                          Ir a cuenta
                        </Button>
                      </Card.Body>
                      <Card.Footer className="text-muted">
                        <span>
                          Última actualización:{" "}
                          {DateFormatter.toDMYH(updatedAt)}
                        </span>
                      </Card.Footer>
                    </Card>
                  </Col>
                )
              )}
            </Row>
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
