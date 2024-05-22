import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  Row,
  Col,
  Modal,
  ListGroup,
  ButtonGroup,
} from "react-bootstrap";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, PageHeader, CustomInput } from "../../components";
import { SweetAlert2 } from "../../utils";
import { NumberFormatter } from "../../helpers";
import { SupplierBasicInfo } from "./interfaces";
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
  const [supplier, setSupplier] = useState<SupplierBasicInfo | null>(null);
  const [accounts, setAccounts] = useState<SupplierAccount[]>([]);
  const [currencies, setCurrencies] = useState([]);
  const [showModal, setShowModal] = useState(false); // [1]

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

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
  };

  const handleSubmit = async (values: any) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Registrar nueva cuenta corriente?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      const formData = { ...values, id_supplier: id };
      const { data } = await apiSJM.post("/supplier_accounts", formData);
      SweetAlert2.successToast(data.message || "¡Cuenta creada!");
      fetch();
      handleClose();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitted(false);
    }
  };

  const handleRedirectAccount = (id_supplier_account: number) => {
    navigate(`/proveedores/${id}/cuentas/${id_supplier_account}`);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && supplier && accounts && (
        <>
          <PageHeader
            goBackTo={`/proveedores/${id}`}
            goBackTitle="Volver al detalle del proveedor"
            title="Listado de cuentas corrientes"
            handleAction={handleCreate}
            actionButtonText="Nueva cuenta"
          />

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
            <>
              {accounts.map((account, index) => (
                <ListGroup
                  key={index}
                  horizontal="lg"
                  className="mb-3 small w-100 border-0 p-0"
                  as={"button"}
                  onClick={() => handleRedirectAccount(account.id)}
                >
                  <ListGroup.Item className="col-12 col-lg-8 bg-light text-center text-lg-start">
                    CUENTA CORRIENTE EN <b>{account.currency.name}</b>
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-lg-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-bold text-muted">SALDO</span>
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
                </ListGroup>
              ))}
            </>
          )}

          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Nueva cuenta corriente</Modal.Title>
            </Modal.Header>
            <Formik
              initialValues={initialForm}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
              validationSchema={Yup.object({
                id_currency: Yup.string().required("La moneda es requerida"),
              })}
            >
              {({ errors, touched }) => (
                <Form id="form">
                  <Modal.Body>
                    <CustomInput.Select
                      label="Moneda de la cuenta corriente"
                      name="id_currency"
                      isInvalid={!!errors.id_currency && touched.id_currency}
                      disabled={isFormSubmitted}
                      isRequired
                    >
                      <option value="">Seleccione una moneda</option>
                      {currencies.map((currency: any) => (
                        <option key={currency.id} value={currency.id}>
                          {currency.name}
                        </option>
                      ))}
                    </CustomInput.Select>
                  </Modal.Body>

                  <Modal.Footer>
                    <ButtonGroup size="sm">
                      <Button
                        variant="secondary"
                        disabled={isFormSubmitted}
                        onClick={handleClose}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isFormSubmitted}
                      >
                        <i className="bi bi-floppy mx-1"></i>{" "}
                        {isFormSubmitted ? "Guardando..." : "Guardar"}
                      </Button>
                    </ButtonGroup>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal>
        </>
      )}
    </>
  );
};
