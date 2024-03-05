import React from "react";
import { Button } from "react-bootstrap";

interface Props {
  handleNavigateBack: () => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => Promise<void>
}

export const SupplierButtons = ({ handleNavigateBack, setIsModalOpen, handleDelete }: Props) => {
  return (
    <div className="small d-flex mb-4">
      <Button
        variant="transparent"
        size="sm"
        onClick={handleNavigateBack}
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
  );
};
