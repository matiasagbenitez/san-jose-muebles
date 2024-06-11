import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfileInterface } from "./interfaces";
import apiSJM from "../../../api/apiSJM";
import { useSelector } from "react-redux";
import { CustomInput, LoadingSpinner } from "../../components";
import { Button, Col, ListGroup, Modal, Row } from "react-bootstrap";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { SweetAlert2 } from "../../utils";

interface PasswordFormInterface {
  password: string;
  new_password: string;
  new_password_confirm: string;
}

const initialPasswordForm: PasswordFormInterface = {
  password: "",
  new_password: "",
  new_password_confirm: "",
};

interface ProfileFormInterface {
  name: string;
  username: string;
  email: string;
  phone: string;
}

const initialProfileForm: ProfileFormInterface = {
  name: "",
  username: "",
  email: "",
  phone: "",
};

export const MyAccount = () => {
  const navigate = useNavigate();

  const { user: user_store } = useSelector((state: any) => state.auth);

  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfileInterface>();
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [profileForm, setProfileForm] =
    useState<ProfileFormInterface>(initialProfileForm);
  const [profileFormSubmitted, setProfileFormSubmitted] =
    useState<boolean>(false);
  const [passwordForm, setPasswordForm] =
    useState<PasswordFormInterface>(initialPasswordForm);
  const [passwordFormSubmitted, setPasswordFormSubmitted] =
    useState<boolean>(false);

  const fetch = async () => {
    try {
      setLoading(true);
      if (!user_store) return navigate("/");
      const { data } = await apiSJM.get(`/auth/${user_store.id}/profile`);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, [user_store]);

  const openProfileModal = () => {
    if (!user) return;
    setProfileForm({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
    });
    setShowProfileModal(true);
  };

  const hideProfileModal = () => {
    setShowProfileModal(false);
  };

  const submitProfileForm = async (values: ProfileFormInterface) => {
    if (!user) return;
    const confirmation = await SweetAlert2.confirm("¿Actualizar información?");
    if (!confirmation.isConfirmed) return;
    try {
      setProfileFormSubmitted(true);
      const { data } = await apiSJM.put(`/auth/${user.id}/profile`, values);
      setUser(data.user);
      SweetAlert2.successToast("¡Información actualizada!");
      hideProfileModal();
    } catch (error: any) {
      console.error(error);
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setProfileFormSubmitted(false);
    }
  };

  const submitPasswordForm = async (values: PasswordFormInterface, resetForm: () => void) => {
    if (!user) return;
    const confirmation = await SweetAlert2.confirm("¿Actualizar constraseña?");
    if (!confirmation.isConfirmed) return;
    try {
      setPasswordFormSubmitted(true);
      const { data } = await apiSJM.patch(`/auth/${user.id}/password`, values);
      SweetAlert2.successToast(data.message);
      resetForm();
      setPasswordForm(initialPasswordForm);
    } catch (error: any) {
      console.error(error);
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setPasswordFormSubmitted(false);
    }
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      {!loading && user && (
        <>
          <h1 className="fs-5 fw-normal">Mi cuenta</h1>
          <hr />
          <Row>
            <Col xs={12} xl={6}>
              <div className="border p-4 rounded-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="fs-5 fw-normal mb-0">Información personal</h2>
                  <Button
                    variant="transparent"
                    size="sm"
                    className="py-0"
                    onClick={openProfileModal}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                </div>
                <hr />
                <Row>
                  <Col xs={12} xl={4}>
                    <label htmlFor="my_name" className="small fw-bold">
                      Nombre
                    </label>
                  </Col>
                  <Col xs={12} xl={8}>
                    <input
                      id="my_name"
                      type="text"
                      value={user.name || ""}
                      className="form-control form-control-sm mb-2"
                      disabled
                    />
                  </Col>
                  <Col xs={12} xl={4}>
                    <label htmlFor="my_user" className="small fw-bold">
                      Usuario
                    </label>
                  </Col>
                  <Col xs={12} xl={8}>
                    <input
                      id="my_user"
                      type="text"
                      value={user.username || ""}
                      className="form-control form-control-sm mb-2"
                      disabled
                    />
                  </Col>
                  <Col xs={12} xl={4}>
                    <label htmlFor="my_email" className="small fw-bold">
                      Correo electrónico
                    </label>
                  </Col>
                  <Col xs={12} xl={8}>
                    <input
                      id="my_email"
                      type="text"
                      value={user.email || ""}
                      className="form-control form-control-sm mb-2"
                      disabled
                    />
                  </Col>
                  <Col xs={12} xl={4}>
                    <label htmlFor="my_phone" className="small fw-bold">
                      Teléfono
                    </label>
                  </Col>
                  <Col xs={12} xl={8}>
                    <input
                      id="my_phone"
                      type="text"
                      value={user.phone || ""}
                      className="form-control form-control-sm mb-2"
                      disabled
                    />
                  </Col>
                  <Col xs={12} xl={4} className="d-flex align-items-center">
                    <span className="small fw-bold">Roles</span>
                  </Col>
                  <Col xs={12} xl={8}>
                    <ListGroup className="mt-3 small">
                      {user.roles.map((role) => (
                        <ListGroup.Item className="small" key={role.id}>
                          {role.name}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col xs={12} xl={6}>
              <div className="border p-4 rounded-3 shadow-sm h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="fs-5 fw-normal mb-0">Actualizar contraseña</h2>
                </div>
                <hr />
                <Formik
                  initialValues={passwordForm}
                  onSubmit={(values, { resetForm }) => {
                    submitPasswordForm(values, resetForm);
                  }}
                  validationSchema={Yup.object({
                    password: Yup.string().required(
                      "La contraseña es requerida"
                    ),
                    new_password: Yup.string()
                      .required("La nueva contraseña es requerida")
                      .min(6, "La contraseña debe tener al menos 6 caracteres"),
                    new_password_confirm: Yup.string()
                      .required("Confirmar la nueva contraseña")
                      .oneOf(
                        [Yup.ref("new_password")],
                        "Las contraseñas no coinciden"
                      ),
                  })}
                >
                  {({ errors, touched }) => (
                    <Form id="form">
                      <CustomInput.Text
                        type="password"
                        label="Contraseña actual"
                        isRequired
                        isInvalid={!!errors.password && touched.password}
                        name="password"
                        placeholder="Ingrese su contraseña actual"
                        disabled={passwordFormSubmitted}
                      />
                      <CustomInput.Text
                        type="password"
                        label="Nueva contraseña"
                        isRequired
                        isInvalid={
                          !!errors.new_password && touched.new_password
                        }
                        name="new_password"
                        placeholder="Ingrese su nueva contraseña"
                        disabled={passwordFormSubmitted}
                      />
                      <CustomInput.Text
                        type="password"
                        label="Confirmar nueva contraseña"
                        isRequired
                        isInvalid={
                          !!errors.new_password_confirm &&
                          touched.new_password_confirm
                        }
                        name="new_password_confirm"
                        placeholder="Confirme su nueva contraseña"
                        disabled={passwordFormSubmitted}
                      />
                      <Button
                        variant="primary"
                        type="submit"
                        size="sm"
                        className="float-end mt-3"
                        disabled={passwordFormSubmitted}
                      >
                        <i className="bi bi-floppy me-2"></i>
                        Actualizar contraseña
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </Col>
          </Row>

          <Modal show={showProfileModal} onHide={hideProfileModal}>
            <Modal.Header>
              <Modal.Title>Actualizar información personal</Modal.Title>
            </Modal.Header>

            <Formik
              initialValues={profileForm || initialProfileForm}
              onSubmit={(values) => {
                submitProfileForm(values);
              }}
              validationSchema={Yup.object({
                name: Yup.string()
                  .required("El nombre es requerido")
                  .max(255, "El nombre no puede superar los 255 caracteres"),
                username: Yup.string()
                  .required("El nombre de usuario es requerido")
                  .max(
                    255,
                    "El nombre de usuario no puede superar los 255 caracteres"
                  ),
                email: Yup.string()
                  .required("El correo electrónico es requerido")
                  .max(
                    255,
                    "El correo electrónico no puede superar los 255 caracteres"
                  )
                  .email("El correo electrónico no es válido"),
                phone: Yup.string()
                  .nullable()
                  .max(255, "El teléfono no puede superar los 255 caracteres"),
              })}
            >
              {({ errors, touched }) => (
                <Form id="form" className="">
                  <Modal.Body>
                    <CustomInput.Text
                      label="Nombre"
                      isRequired
                      isInvalid={!!errors.name && touched.name}
                      name="name"
                      placeholder="Ingrese su nombre"
                      disabled={profileFormSubmitted}
                    />
                    <CustomInput.Text
                      label="Usuario"
                      isRequired
                      isInvalid={!!errors.username && touched.username}
                      name="username"
                      placeholder="Ingrese su nombre de usuario"
                      disabled={profileFormSubmitted}
                    />
                    <CustomInput.Text
                      type="email"
                      label="Correo electrónico"
                      isRequired
                      isInvalid={!!errors.email && touched.email}
                      name="email"
                      placeholder="Ingrese su correo electrónico"
                      disabled={profileFormSubmitted}
                    />
                    <CustomInput.Text
                      label="Teléfono"
                      isInvalid={!!errors.phone && touched.phone}
                      name="phone"
                      placeholder="Ingrese su número de teléfono (opcional)"
                      disabled={profileFormSubmitted}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={hideProfileModal}
                      disabled={profileFormSubmitted}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      size="sm"
                      disabled={profileFormSubmitted}
                    >
                      <i className="bi bi-floppy me-2"></i>
                      Confirmar
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal>
        </>
      )}
    </div>
  );
};
