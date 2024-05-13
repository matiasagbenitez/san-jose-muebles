import { useState, useEffect } from "react";
import { Button, Card, Row, Col, Modal, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { SweetAlert2 } from "../../utils";
import { DateFormatter, NumberFormatter } from "../../helpers";
interface SupplierAccount {
  id: number;
  currency: {
    name: string;
    symbol: string;
    is_monetary: boolean;
  };
  balance: number;
  updatedAt: Date;
}

const initialForm = {
  id_currency: "",
};

export const SupplierAccounts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // [1]
  const [supplier, setSupplier] = useState<any>(""); // [1]
  const [accounts, setAccounts] = useState<SupplierAccount[]>([]);
  const [currencies, setCurrencies] = useState([]);
  const [showModal, setShowModal] = useState(false); // [1]
  const [form, setForm] = useState(initialForm);

  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        apiSJM.get(`/supplier_accounts/supplier/${id}`),
        apiSJM.get("/currencies/monetaries"),
      ]);
      setAccounts(res1.data.accounts);
      setSupplier(res1.data.supplier);
      setCurrencies(res2.data.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      navigate(`/proveedores/${id}`);
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
        const formData = { ...form, id_supplier: id };
        const { data } = await apiSJM.post("/supplier_accounts", formData);
        SweetAlert2.successToast(data.message || "¡Cuenta creada!");
        setAccounts([...accounts, data.account]);
        handleClose();
      }
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  const handleRedirectAccount = (id: number) => {
    navigate(`/cuentas-proveedores/${id}`);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <Row className="d-flex align-items-center">
            <Col xs={6} lg={1}>
              <Button
                variant="light border text-muted w-100"
                size="sm"
                onClick={() => navigate(`/proveedores/${id}`)}
                title="Volver al detalle del proveedor"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Atrás
              </Button>
            </Col>
            <Col xs={{ span: 6, order: 1 }} lg={{ span: 2, offset: 1 }}>
              <Button
                size="sm"
                variant="success"
                onClick={handleCreate}
                title="Registrar nueva cuenta corriente"
                className="w-100"
              >
                Nueva cuenta
              </Button>
            </Col>
            <Col xs={{ span: 12, order: 2 }} lg={{ span: 8, order: 0 }}>
              <h1 className="fs-5 my-3 my-lg-0">
                Listado de cuentas corrientes
              </h1>
            </Col>
          </Row>

          <hr className="mt-0 mt-lg-3" />

          <Row>
            <Col xs={12} md={6}>
              <p className="text-muted">
                Proveedor: <span className="fw-bold">{supplier.name}</span>
              </p>
            </Col>
            <Col xs={12} md={6}>
              <p className="text-muted">
                Localidad: <span className="fw-bold">{supplier.locality}</span>
              </p>
            </Col>
          </Row>

          {accounts.length === 0 ? (
            <p className="text-muted text-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              El proveedor no tiene cuentas corrientes registradas
            </p>
          ) : (
            <Row>
              {accounts.map(
                (
                  { id, currency, balance, updatedAt }: SupplierAccount,
                  index
                ) => (
                  <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                    <Card className="text-center small">
                      <Card.Header>CUENTA CORRIENTE PROVEEDOR</Card.Header>
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
