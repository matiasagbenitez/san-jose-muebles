import { Alert, Col, Row } from "react-bootstrap";
import { NullationInterface } from "../../interfaces";
import { DayJsAdapter } from "../../../../../helpers";

interface Props {
  nullation: NullationInterface | null | undefined;
}

export const PurchaseNullation = ({ nullation }: Props) => {
  return (
    <>
      {nullation && (
        <Row>
          <Col>
            <Alert
              variant="danger"
              className="px-3 p-2 d-flex align-items-center"
            >
              <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
              <b>
                Compra anulada el {" "}
                {DayJsAdapter.toDayMonthYearHour(nullation.at)} por{" "}
                {nullation.by}
              </b>
              <i className="bi bi-chat-right-text ms-4 me-2 fs-6"></i>{" "}
              <small className="fst-italic small">{nullation.reason}</small>
            </Alert>
          </Col>
        </Row>
      )}
    </>
  );
};
