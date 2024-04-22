import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export const Parameters = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="fs-5 fw-normal">Parámetros de la aplicación</h1>
      <hr />

      <Row className="m-0">
        <Col xs={12} md={6} xl={3} className="px-2 mb-4">
          <h2 className="fs-6 my-2">Parámetros geográficos</h2>
          <div className="list-group small">
            <button
              className="list-group-item list-group-item-action py-1"
              title="Gestionar países"
              onClick={() => navigate("/parametros/paises")}
            >
              <i className="bi bi-globe me-2 fs-6"></i>
              Gestionar países
            </button>
            <button
              className="list-group-item list-group-item-action py-1"
              title="Gestionar provincias"
              onClick={() => navigate("/parametros/provincias")}
            >
              <i className="bi bi-map me-2 fs-6"></i>
              Gestionar provincias
            </button>
            <button
              className="list-group-item list-group-item-action py-1"
              title="Gestionar localidades"
              onClick={() => navigate("/parametros/localidades")}
            >
              <i className="bi bi-geo-alt me-2 fs-6"></i>
              Gestionar localidades
            </button>
          </div>
        </Col>

        <Col xs={12} md={6} xl={3} className="px-2 mb-4">
          <h2 className="fs-6 my-2">Parámetros de productos</h2>
          <div className="list-group small">
            <button
              className="list-group-item list-group-item-action py-1"
              title="Gestionar marcas de productos"
              onClick={() => navigate("/parametros/marcas")}
            >
              <i className="bi bi-tags me-2 fs-6"></i>
              Gestionar marcas de productos
            </button>
            <button
              className="list-group-item list-group-item-action py-1"
              title="Gestionar categorías de productos"
              onClick={() => navigate("/parametros/categorias")}
            >
              <i className="bi bi-list me-2 fs-6"></i>
              Gestionar categorías de productos
            </button>
            <button
              className="list-group-item list-group-item-action py-1"
              title="Gestionar unidades de medida"
              onClick={() => navigate("/parametros/unidades-medida")}
            >
              <i className="bi bi-rulers me-2 fs-6"></i>
              Gestionar unidades de medida
            </button>
          </div>
        </Col>

        <Col xs={12} md={6} xl={3} className="px-2 mb-4">
          <h2 className="fs-6 my-2">
            Parámetros de inventario de herramientas
          </h2>
          <div className="list-group small">
            <button
              className="list-group-item list-group-item-action py-1"
              title="Gestionar marcas de herramientas"
              onClick={() => navigate("/parametros/marcas-herramientas")}
            >
              <i className="bi bi-tags me-2 fs-6"></i>
              Gestionar marcas de herramientas
            </button>
            <button
              className="list-group-item list-group-item-action py-1"
              title="Gestionar categorías de herramientas"
              onClick={() => navigate("/parametros/categorias-herramientas")}
            >
              <i className="bi bi-list me-2 fs-6"></i>
              Gestionar categorías de herramientas
            </button>
          </div>
        </Col>

        <Col xs={12} md={6} xl={3} className="px-2 mb-4">
          <h2 className="fs-6 my-2">Parámetros de finanzas</h2>
          <div className="list-group small">
            <button
              className="list-group-item list-group-item-action py-1"
              title="Gestionar monedas"
              onClick={() => navigate("/parametros/monedas")}
            >
              <i className="bi bi-currency-dollar me-2 fs-6"></i>
              Gestionar monedas
            </button>
            <button
              className="list-group-item list-group-item-action py-1"
              title="Gestionar métodos de pago"
              onClick={() => navigate("/parametros/metodos-pago")}
            >
              <i className="bi bi-credit-card me-2 fs-6"></i>
              Gestionar métodos de pago
            </button>
            <button
              className="list-group-item list-group-item-action py-1"
              title="Gestionar bancos"
              onClick={() => navigate("/parametros/bancos")}
            >
              <i className="bi bi-bank me-2 fs-6"></i>
              Gestionar bancos
            </button>
          </div>
        </Col>

        <Col xs={12} md={6} xl={3} className="px-2 mb-4">
          <h2 className="fs-6 my-2">Otros parámetros</h2>
          <div className="list-group small">
            <button
              className="list-group-item list-group-item-action py-1"
              title="Gestionar motivos de visita"
              onClick={() => navigate("/parametros/motivos-visita")}
            >
              <i className="bi bi-person-raised-hand me-2 fs-6"></i>
              Gestionar motivos de visita
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
