import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button, Modal } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { ItemData, Options, InventoryItemsForm } from "./components";

import { EditableItem } from "./interfaces";
import { SweetAlert2 } from "../../utils";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { MySelect, MyTextArea } from "../../components/forms";

interface InitialStatusFormInterface {
  status: "RESERVADO" | "OPERATIVO" | "RETIRADO" | "DESCARTADO";
  comment: string;
}

const initialStatusForm: InitialStatusFormInterface = {
  status: "OPERATIVO",
  comment: "",
};

export const InventoryItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [item, setItem] = useState<any>();
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<any>({});

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState(initialStatusForm);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2, res3] = await Promise.all([
        apiSJM.get(`/inventory_items/${id}`),
        apiSJM.get("/inventory_brands"),
        apiSJM.get("/inventory_categories"),
      ]);
      setItem(res1.data.item);
      setBrands(res2.data.items);
      setCategories(res3.data.items);
      setForm(res1.data.item.editable_fields);
      setStatusForm({ status: res1.data.item.data.status, comment: "" });
      setLoading(false);
    } catch (error) {
      return navigate("/inventory_items");
    }
  };

  const fetchItem = async () => {
    try {
      const { data } = await apiSJM.get(`/inventory_items/${id}`);
      setItem(data.item);
      setForm(data.item.editable_fields);
      setStatusForm({ status: data.item.data.status, comment: "" });
    } catch (error) {
      console.log(error);
      SweetAlert2.errorAlert("Ocurrió un error al obtener el artículo");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleHide = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData: EditableItem) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de modificar este artículo?"
    );
    if (confirmation.isConfirmed) {
      try {
        setIsFormSubmitting(true);
        const { data } = await apiSJM.put(`/inventory_items/${id}`, formData);
        SweetAlert2.successToast(data.message || "¡Operación exitosa!");
        fetchItem();
        setIsModalOpen(false);
      } catch (error) {
        console.log(error);
        SweetAlert2.errorAlert("Ocurrió un error al modificar el artículo");
      } finally {
        setIsFormSubmitting(false);
      }
    }
  };

  const handleDelete = async () => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de eliminar este artículo?"
    );
    if (confirmation.isConfirmed) {
      try {
        const { data } = await apiSJM.delete(`/inventory_items/${id}`);
        SweetAlert2.successToast(data.message || "¡Operación exitosa!");
        navigate("/inventario");
      } catch (error) {
        console.log(error);
        SweetAlert2.errorAlert("Ocurrió un error al eliminar el artículo");
      }
    }
  };

  const openStatusModal = () => {
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
  };

  const handleStatusSubmit = async (formData: InitialStatusFormInterface) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de modificar el estado de este artículo?"
    );
    if (confirmation.isConfirmed) {
      try {
        setIsFormSubmitting(true);
        const { data } = await apiSJM.put(
          `/inventory_items/${id}/status`,
          formData
        );
        SweetAlert2.successToast(
          data.message || "Estado del artículo modificado correctamente"
        );
        fetch();
        setShowStatusModal(false);
        setStatusForm(initialStatusForm);
      } catch (error) {
        console.log(error);
        SweetAlert2.errorAlert("Ocurrió un error al modificar el estado");
      } finally {
        setIsFormSubmitting(false);
      }
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Row>
            <div className="d-flex gap-3 align-items-center mb-3">
              <Button
                variant="light border text-muted"
                size="sm"
                onClick={() => navigate(`/inventario`)}
                title="Volver al inventario de artículos"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Atrás
              </Button>
              <h1 className="fs-5 my-0">{item.data.name}</h1>
            </div>
            <Col lg={9}>
              <ItemData item={item.data} />
            </Col>
            <Col lg={3}>
              <Options
                handleStatus={openStatusModal}
                handleOpen={handleOpen}
                handleDelete={handleDelete}
              />
            </Col>
          </Row>
          
          <InventoryItemsForm
            show={isModalOpen}
            onHide={handleHide}
            onSubmit={handleSubmit}
            brands={brands}
            categories={categories}
            initialForm={form}
            editMode
            isFormSubmitting={isFormSubmitting}
          />

          <Modal show={showStatusModal} onHide={closeStatusModal}>
            <Modal.Header closeButton>
              <Modal.Title>Actualizar estado del artículo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formik
                initialValues={statusForm}
                onSubmit={(values) => {
                  handleStatusSubmit(values);
                }}
                validationSchema={Yup.object({
                  status: Yup.string()
                    .required("El estado es requerido")
                    .test(
                      "is-different",
                      "El estado debe ser diferente al actual",
                      (value) => value !== item.data.status
                    ),

                  comment: Yup.string()
                    .required("El comentario es requerido")
                    .min(5, "El comentario debe tener al menos 5 caracteres")
                    .max(
                      255,
                      "El comentario debe tener como máximo 255 caracteres"
                    ),
                })}
              >
                {({ errors, touched }) => (
                  <Form id="form">
                    <MySelect
                      label="Estado del artículo"
                      name="status"
                      as="select"
                      isInvalid={!!errors.status && touched.status}
                      disabled={isFormSubmitting}
                    >
                      <option value="RESERVADO">RESERVADO</option>
                      <option value="OPERATIVO">OPERATIVO</option>
                      <option value="RETIRADO">RETIRADO</option>
                      <option value="DESCARTADO">DESCARTADO</option>
                    </MySelect>

                    <MyTextArea
                      label="Comentarios"
                      name="comment"
                      placeholder="Ingrese un comentario"
                      rows={4}
                      isInvalid={!!errors.comment && touched.comment}
                      disabled={isFormSubmitting}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      className="mt-3 float-end"
                      size="sm"
                      disabled={isFormSubmitting}
                    >
                      <i className="bi bi-floppy me-1"></i>
                      Guardar cambios
                    </Button>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};
