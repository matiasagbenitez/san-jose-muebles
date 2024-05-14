import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { SupplierInterface } from "../../interfaces";
import { SuppliersForm, SupplierInfo, SupplierOptions } from ".";
import { LoadingSpinner } from "../../components";
import { SweetAlert2 } from "../../utils";

export const Supplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
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
      setIsFormSubmitting(true);
      const confirmation = await SweetAlert2.confirm(
        "¿Estás seguro de que quieres modificar este proveedor?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.put(`/suppliers/${id}`, formData);
      SweetAlert2.successToast(data.message);
      setIsModalOpen(false);
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const confirmation = await SweetAlert2.confirm(
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
        <>
          <Row className="mb-0 mb-lg-3 d-flex align-items-center">
            <Col xs={12} sm={2} xxl={1}>
              <Button
                variant="light border text-muted"
                size="sm"
                onClick={() => navigate(`/proveedores`)}
                title="Volver al listado de proveedores"
                className="w-100"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Atrás
              </Button>
            </Col>
            <Col xs={12} sm={10} xxl={11}>
              <h1 className="fs-5 my-3 my-lg-0">{supplier.name}</h1>
            </Col>
          </Row>
          <Row>
            <Col xs={12} xl={8}>
              <SupplierInfo supplier={supplier} />
            </Col>
            <Col xs={12} xl={4}>
              <SupplierOptions
                id={+id!}
                setIsModalOpen={setIsModalOpen}
                handleDelete={handleDelete}
              />
            </Col>
          </Row>
          
          <SuppliersForm
            show={isModalOpen}
            onHide={handleHide}
            editMode={true}
            onSubmit={handleSubmit}
            initialForm={supplier}
            isFormSubmitting={isFormSubmitting}
          />
        </>
      )}
    </>
  );
};
