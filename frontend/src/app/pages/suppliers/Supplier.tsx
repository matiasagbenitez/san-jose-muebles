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
      const confirmation = await SweetAlert2.confirm(
        "¿Estás seguro de que quieres modificar este proveedor?"
      );
      if (!confirmation.isConfirmed) return;
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
          <Row>
            <Col lg={6}>
              <div className="d-flex gap-3 align-items-center mb-3">
                <Button
                  variant="light border text-muted"
                  size="sm"
                  onClick={() => navigate(`/proveedores`)}
                  title="Volver al listado de proveedores"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Atrás
                </Button>
                {/* <h1 className="fs-5 my-0">Proveedor #{supplier.id}: {supplier.name}</h1> */}
                <h1 className="fs-5 my-0">Proveedor: {supplier.name}</h1>
              </div>
              <SupplierInfo supplier={supplier} />
            </Col>
            <Col lg={6}>
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
            isFormSubmitted={isFormSubmitted}
          />
        </>
      )}
    </>
  );
};
