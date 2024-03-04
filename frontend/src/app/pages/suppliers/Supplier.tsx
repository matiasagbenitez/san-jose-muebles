import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";
import { SupplierInterface } from "../../interfaces";
import { Button, Col, Row, Table } from "react-bootstrap";
import { SuppliersForm } from ".";
import { SweetAlert2 } from "../../utils";
import { LoadingSpinner } from "../../components";

export const Supplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [supplier, setSupplier] = useState<SupplierInterface>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/suppliers/${id}`);
      setSupplier(data.supplier);
      setLoading(false);
    } catch (error) {
      return navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleHide = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData: SupplierInterface) => {
    try {
      setIsFormSubmitted(true);
      const { data } = await apiSJM.put(`/suppliers/${id}`, formData);
      SweetAlert2.successToast(data.message);
      setIsModalOpen(false);
      setIsFormSubmitted(false);
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      const confirmation = await SweetAlert2.confirmationDialog(
        "¿Estás seguro de que quieres eliminar este proveedor?"
      );
      if (confirmation.isConfirmed) {
        await apiSJM.delete(`/suppliers/${id}`);
        navigate("/proveedores");
        SweetAlert2.successToast("Proveedor eliminado correctamente");
      }
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {supplier && !loading && (
        <Row className="striped">
          <Col lg={6}>
            <h1 className="fs-3">{supplier.name}</h1>
            <Table size="sm" className="small" striped bordered responsive>
              <tbody>
                <tr>
                  <th scope="row">Proveedor</th>
                  <td>{supplier.name}</td>
                </tr>
                <tr>
                  <th scope="row">DNI/CUIT</th>
                  <td>{supplier.dni_cuit}</td>
                </tr>
                <tr>
                  <th scope="row">Teléfono</th>
                  <td>{supplier.phone}</td>
                </tr>
                <tr>
                  <th scope="row">Email</th>
                  <td>{supplier.email}</td>
                </tr>
                <tr>
                  <th scope="row">Dirección</th>
                  <td>{supplier.address}</td>
                </tr>
                <tr>
                  <th scope="row">Localidad</th>
                  <td>{supplier.locality}</td>
                </tr>
                {/* text wrap */}
                <tr>
                  <th scope="row">Anotaciones</th>
                  <td>
                    <div className="text-break">
                      <small>{supplier.annotations}</small>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
            <div className="small d-flex">
              <Button
                variant="transparent"
                size="sm"
                onClick={() => navigate(-1)}
                className="px-2 py-0"
              >
                <i className="bi bi-arrow-left me-2"></i>
                <small>Volver</small>
              </Button>

              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="px-2 py-0 ms-2"
              >
                <i className="bi bi-pencil me-2"></i>
                <small>Editar información</small>
              </Button>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleDelete}
                className="px-2 py-0 ms-2"
              >
                <i className="bi bi-trash me-2"></i>
                <small>Eliminar proveedor</small>
              </Button>
            </div>
          </Col>

          <Col lg={6}>
            <h2 className="fs-5" style={{ marginTop: "8px" }}>
              Menú de opciones
            </h2>
            <Table size="sm" className="small" responsive>
              <tbody>
                <tr>
                  <td className="p-0 border-0">
                    <Button
                      variant="light"
                      size="sm"
                      className="text-start w-100 rounded-0"
                      title="Registrar una nueva compra"
                    >
                      <i className="bi bi-cart-plus-fill me-2"></i>
                      <small>Registrar una nueva compra</small>
                    </Button>
                  </td>
                </tr>

                <tr>
                  <td className="p-0 border-0">
                    <Button
                      variant="light"
                      size="sm"
                      className="text-start w-100 rounded-0"
                      title="Compras registradas del proveedor"
                    >
                      <i className="bi bi-cart4 me-2"></i>
                      <small>Compras registradas</small>
                    </Button>
                  </td>
                </tr>

                <tr>
                  <td className="p-0 border-0">
                    <Button
                      variant="light"
                      size="sm"
                      className="text-start w-100 rounded-0"
                      title="Pagos realizados al proveedor"
                    >
                      <i className="bi bi-cash-stack me-2"></i>
                      <small>Pagos realizados</small>
                    </Button>
                  </td>
                </tr>

                <tr>
                  <td className="p-0 border-0">
                    <Button
                      variant="light"
                      size="sm"
                      className="text-start w-100 rounded-0"
                      title="Cuentas bancarias del proveedor"
                    >
                      <i className="bi bi-bank me-2"></i>
                      <small>Cuentas bancarias</small>
                    </Button>
                  </td>
                </tr>

                
              </tbody>
            </Table>
          </Col>

          <SuppliersForm
            show={isModalOpen}
            onHide={handleHide}
            onSubmit={handleSubmit}
            initialForm={supplier}
            isFormSubmitted={isFormSubmitted}
          />
        </Row>
      )}
    </>
  );
};
