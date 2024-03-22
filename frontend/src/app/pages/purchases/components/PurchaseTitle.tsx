import { Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const PurchaseTitle = ({
  purchaseId,
  isNullified,
  isFullyStocked,
}: {
  purchaseId: number;
  isNullified: boolean;
  isFullyStocked: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex gap-2 align-items-center">
        <Button
          variant="light border text-muted"
          size="sm"
          onClick={() => navigate(`/compras`)}
          title="Volver al listado de compras"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Atrás
        </Button>
        <h1 className="fs-4 my-0">
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
      </div>
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
