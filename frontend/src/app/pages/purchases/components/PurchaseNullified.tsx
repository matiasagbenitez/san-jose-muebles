import { Alert } from "react-bootstrap";
import { NullifiedInterface } from "../interfaces";
import { DayJsAdapter } from "../../../../helpers";

export const PurchaseNullified = ({
  nullifiedData,
}: {
  nullifiedData: NullifiedInterface;
}) => {
  const { nullifier, nullified_date, nullified_reason } = nullifiedData;

  return (
    <Alert variant="danger" className="small py-1 px-3">
      {/* <Alert.Heading className="fs-6">
        <i className="bi bi-exclamation-triangle fs-5 me-2"></i> Esta compra ha
        sido anulada el {DayJsAdapter.toDayMonthYearHour(nullified_date)} por el
        usuario {nullifier}. El motivo especificado es:
      </Alert.Heading> */}
      {/* <hr className="my-2" />
      <p className="mb-0">{nullified_reason}</p> */}
      <div className="d-flex align-items-center">
        <div>
          <i className="bi bi-exclamation-triangle fs-3 me-2"></i>
        </div>
        <div className="w-100">
          <span className="fw-bold">
            Compra anulada el {DayJsAdapter.toDayMonthYearHour(nullified_date)}{" "}
            por {nullifier} |{" "}
          </span>
          <span>Motivo: {nullified_reason}</span>
        </div>
      </div>
    </Alert>
  );
};
