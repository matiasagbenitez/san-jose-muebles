import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { SupplierInterface } from "../../interfaces";
import { SuppliersForm, SupplierInfo, SupplierOptions } from ".";
import { GoBackButton, LoadingSpinner } from "../../components";
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
      const confirmation = await SweetAlert2.confirmationDialog(
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
        <>
          <Row>
            <Col lg={6}>
              <SupplierInfo supplier={supplier} />
            </Col>
            <Col lg={6}>
              <SupplierOptions id={+id!} setIsModalOpen={setIsModalOpen} handleDelete={handleDelete} />
            </Col>
            <Col lg={6}>
              <GoBackButton />
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
