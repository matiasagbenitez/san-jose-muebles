import { useState, useEffect } from "react";
import { Button, Card, Row, Col, Modal, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { DayJsAdapter, toMoney } from "../../../helpers";
import { SweetAlert2 } from "../../utils";

const initialForm = {
  id_currency: "",
};

export const ProjectAccounts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<string>("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);

  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        apiSJM.get(`/project_accounts/project/${id}`),
        apiSJM.get("/currencies"),
      ]);
      setAccounts(res1.data.accounts);
      setProject(res1.data.project);
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
    }
  };

  const handleRedirectAccount = (id: number) => {
    // navigate(`/cuentas-proveedores/${id}`);
    alert(`No implementado: redireccionar a la cuenta corriente con id ${id}`);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-3 align-items-center">
              <Button
                variant="light border text-muted"
                size="sm"
                onClick={() => navigate(`/proyectos/${id}`)}
                title="Volver al detalle del proyecto"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Atrás
              </Button>
              <h1 className="fs-5 my-0">
                Cuentas corrientes de <span className="fw-bold">{project}</span>
              </h1>
            </div>
            <Button size="sm" variant="success" onClick={handleCreate}>
              Nueva cuenta
            </Button>
          </div>
          <hr />
          {accounts.length === 0 ? (
            <p className="text-muted text-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              El proyecto no tiene cuentas corrientes registradas
            </p>
          ) : (
            <Row>
              {accounts.map((account: any) => (
                <Col key={account.id} xs={12} md={6} lg={4} className="mb-3">
                  <Card className="text-center small">
                    <Card.Header>{project}</Card.Header>
                    <Card.Body>
                      <Card.Title>Cuenta en {account.currency}</Card.Title>
                      <Card.Subtitle className="my-3 text-muted">
                        <span>Saldo: </span>
                        {account.balance < 0 ? (
                          <span className="text-danger">
                            - ${toMoney(account.balance * -1)}
                          </span>
                        ) : account.balance == 0 ? (
                          <span className="text-muted">
                            {account.is_monetary && "$"}
                            {toMoney(account.balance)}
                          </span>
                        ) : (
                          <span className="text-success">
                            + ${toMoney(account.balance)}
                          </span>
                        )}
                      </Card.Subtitle>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRedirectAccount(account.id)}
                      >
                        Ir a cuenta
                      </Button>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                      <span>
                        Última actualización:{" "}
                        {DayJsAdapter.toDayMonthYearHour(account.updatedAt)}
                      </span>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
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
                  <Button type="submit" size="sm" variant="primary">
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
