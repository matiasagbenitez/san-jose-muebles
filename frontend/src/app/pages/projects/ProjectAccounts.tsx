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
import { CustomInput, LoadingSpinner, PageHeader } from "../../components";
import { SweetAlert2 } from "../../utils";
import { ProjectAccountsData, ProjectBasicData } from "./interfaces";
import { NumberFormatter } from "../../helpers";

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
  };

  const handleSubmit = async (values: { id_currency: string }) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Registrar nueva cuenta corriente?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      setIsFormSubmitting(true);
      const formData = { ...values, id_project: id };
      const { data } = await apiSJM.post("/project_accounts", formData);
      SweetAlert2.successToast(data.message || "¡Cuenta creada!");
      fetch();
      handleClose();
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
          </Row>

          {accounts.length === 0 ? (
            <p className="text-muted text-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              El proyecto no tiene cuentas corrientes registradas
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
                      disabled={isFormSubmitting}
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
                        disabled={isFormSubmitting}
                        onClick={handleClose}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isFormSubmitting}
                      >
                        <i className="bi bi-floppy mx-1"></i>{" "}
                        {isFormSubmitting ? "Guardando..." : "Guardar"}
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
