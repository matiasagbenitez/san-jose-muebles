import { Badge } from "react-bootstrap";

export const PurchaseTitle = (
  { purchaseId, isNullified, isFullyStocked }:
    { purchaseId: number, isNullified: boolean, isFullyStocked: boolean }
) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <h1 className="fs-4">
        Compra #{purchaseId}
        {isNullified ? (
          <i
            className="bi bi-x-circle-fill text-danger fs-5 ms-2"
            title="Compra anulada"
          ></i>
        ) : (
          <i
            className="bi bi-check-circle-fill text-success fs-5 ms-2"
            title="Compra válida"
          ></i>
        )}
      </h1>
      <div className="d-flex align-items-center ">
        {!isNullified && isFullyStocked ? (
          <Badge bg="success" className="me-2">
            STOCK COMPLETO
          </Badge>
        ) : (
          <Badge bg="warning" className="me-2">
            STOCK PENDIENTE
          </Badge>
        )}
      </div>
    </div>
  );
};
