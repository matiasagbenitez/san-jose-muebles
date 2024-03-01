import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import './styles.css';

export const Parameters = () => {
  return (
    <div>
        <h1 className="fs-5 fw-normal">Parámetros de la aplicación</h1>
        <hr />
        <Row className="m-0">
            <Col xs={12} md={6} xl={4} className="px-0 mb-4">
                <span className="fw-bold">
                    <i className="bi bi-box-seam me-2"></i>
                    Parámetros de productos
                </span>
                <ul className="mt-2">
                    <li><Link to="/parametros/marcas" className="text-link">Marcas</Link></li>
                    <li><Link to="/parametros/categorias" className="text-link">Categorias</Link></li>
                    <li><Link to="/parametros/unidades-medida" className="text-link">Unidades de medida</Link></li>
                </ul>
            </Col>
            <Col xs={12} md={6} xl={4} className="px-0 mb-4">
                <span className="fw-bold">
                    <i className="bi bi-kanban me-2"></i>
                    Parámetros de proyectos
                </span>
                <ul className="mt-2">
                    <li><Link to="/parametros/prioridades" className="text-link">Prioridades</Link></li>
                    <li><Link to="/parametros/tipos-proyectos" className="text-link">Tipos de proyectos</Link></li>
                </ul>
            </Col>
            <Col xs={12} md={6} xl={4} className="px-0 mb-4">
                <span className="fw-bold">
                    <i className="bi bi-globe-americas me-2"></i>
                    Parámetros geográficos
                </span>
                <ul className="mt-2">
                    <li><Link to="/parametros/paises" className="text-link">Países</Link></li>
                    <li><Link to="/parametros/provincias" className="text-link">Provincias</Link></li>
                    <li><Link to="/parametros/localidades" className="text-link">Localidades</Link></li>
                </ul>
            </Col>
            <Col xs={12} md={6} xl={4} className="px-0 mb-4">
                <span className="fw-bold">
                    <i className="bi bi-cash-coin me-2"></i>
                    Parámetros de finanzas
                </span>
                <ul className="mt-2">
                    <li><Link to="/parametros/monedas" className="text-link">Monedas</Link></li>
                    <li><Link to="/parametros/metodos-pago" className="text-link">Métodos de pago</Link></li>
                </ul>
            </Col>
        </Row>
    </div>
  );
};
