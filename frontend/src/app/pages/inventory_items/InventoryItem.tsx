import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import {
  ItemData,
  ItemRetirements,
  ItemUpdates,
  Options,
  InventoryItemsForm,
} from "./components";

import { EditableItem } from "./interfaces";
import { SweetAlert2 } from "../../utils";

export const InventoryItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [item, setItem] = useState<any>();
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<any>({});

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
      setLoading(false);
    } catch (error) {
      return navigate("/inventory_items");
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
        const { data } = await apiSJM.put(`/inventory_items/${id}`, formData);
        SweetAlert2.successToast(
          data.message || "Artículo modificado correctamente"
        );
        fetch();
        setIsModalOpen(false);
      } catch (error) {
        console.log(error);
        SweetAlert2.errorAlert("Ocurrió un error al modificar el artículo");
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
        SweetAlert2.successToast(
          data.message || "Artículo eliminado correctamente"
        );
        navigate("/inventario");
      } catch (error) {
        console.log(error);
        SweetAlert2.errorAlert("Ocurrió un error al eliminar el artículo");
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
            <Col lg={6}>
              <ItemData item={item.data} />
            </Col>
            <Col lg={6}>
              <Options handleOpen={handleOpen} handleDelete={handleDelete} />
            </Col>
            <Col lg={6}>
              <ItemUpdates updates={item.updates} />
            </Col>
            <Col>{/* NOTHING */}</Col>
            <Col lg={6}>
              <ItemRetirements retirements={item.retirements} />
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
          />
        </>
      )}
    </>
  );
};
