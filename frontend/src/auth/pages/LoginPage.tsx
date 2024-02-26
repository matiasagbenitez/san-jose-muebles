import { Fragment, useEffect } from "react";
import { Button, Form, Row, Col, Image, Container } from "react-bootstrap";
import { useForm } from "../hooks/useForm";
import { useAuthStore } from "../../hooks";
import { SonnerToast } from "../../utils";

import "./LoginPage.css";

export const LoginPage = () => {
  const { startLogin, errorMessage } = useAuthStore();

  const initialForm = { username: "matiasagbenitez", password: "123456" };
  const { username, password, onChange } = useForm(initialForm);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === "" || password === "") return;
    startLogin({ username, password });
  };

  useEffect(() => {
    document.title = `SJM | Iniciar sesión`;
  }, []);

  useEffect(() => {
    if (errorMessage) {
      SonnerToast.error(errorMessage);
    }
  }, [errorMessage]);

  return (
    <Fragment>
      <Row className="div-centered div-100h mx-0 bg-melamina">
        <Col xs={12} md={6} xl={4} className="rounded">
          <Container>
            {/* LOGO */}
            <Container className="div-centered">
              <Image src="/logos/logo-transparent.png" height={200} />
            </Container>

            {/* SAN JOSÉ MUEBLES */}
            <h1 className="text-center fw-light fs-2 my-3 text-black">
              San José <span className="fw-bold">Muebles</span>
            </h1>

            {/* FORM */}
            <Container className="px-4 mt-4">
              <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Control
                  name="username"
                  type="text"
                  placeholder="Correo electrónico"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    fontSize: "1rem",
                  }}
                  className="mb-3"
                  value={username}
                  onChange={onChange}
                  autoComplete="off"
                />
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    fontSize: "1rem",
                  }}
                  className="mb-3"
                  value={password}
                  onChange={onChange}
                  autoComplete="off"
                />
                <Button
                  size="sm"
                  type="submit"
                  className="w-100"
                  title="Ingresar al sistema"
                  style={{
                    fontSize: "1rem",
                    backgroundColor: "black",
                    border: "none",
                  }}
                >
                  Ingresar
                </Button>
              </Form>
            </Container>
          </Container>
        </Col>
      </Row>
    </Fragment>
  );
};
