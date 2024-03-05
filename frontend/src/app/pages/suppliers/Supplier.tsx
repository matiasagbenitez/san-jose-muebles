import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";
import { SupplierInterface } from "../../interfaces";
import { Row, Col } from "react-bootstrap";
import { SuppliersForm, SupplierInfo, SupplierButtons, SupplierOptions, } from ".";
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

  const handleNavigateBack = () => {
    navigate(-1);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {supplier && !loading && (
        <>
          <Row>
            <Col lg={6}>
              <SupplierInfo supplier={supplier} />
              <SupplierButtons
                handleNavigateBack={handleNavigateBack}
                setIsModalOpen={setIsModalOpen}
                handleDelete={handleDelete}
              />
            </Col>
            <Col lg={6}>
              <SupplierOptions id={+id!} />
            </Col>
          </Row>

          <SuppliersForm
            show={isModalOpen}
            onHide={handleHide}
            onSubmit={handleSubmit}
            initialForm={supplier}
            isFormSubmitted={isFormSubmitted}
          />
        </>
      )}
    </>
  );
};
