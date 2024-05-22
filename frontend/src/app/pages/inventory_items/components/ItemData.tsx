import { Col, ListGroup, Row, Table } from "react-bootstrap";
import { ItemData as Data, InventoryStatus } from "../interfaces";
import { DayJsAdapter } from "../../../../helpers";

interface Props {
  item: Data;
}

export const ItemData = ({ item }: Props) => {
  return (
    <>
      <Table
        size="sm"
        className="small align-middle"
        striped
        bordered
        responsive
      >
        <tbody className="text-uppercase">
          <tr className="text-center fw-bold">
            <td colSpan={2}>Información del artículo</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Estado actual
            </th>
            <td className="px-2">
              <span
                style={{
                  fontSize: ".9em",
                  backgroundColor: InventoryStatus[item.status] || "gray",
                  color: "black",
                }}
                className="badge rounded-pill"
              >
                {item.status}
              </span>
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2 col-3">
              Categoría
            </th>
            <td className="px-2">{item.category}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Marca
            </th>
            <td className="px-2">{item.brand}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Nombre
            </th>
            <td className="px-2">{item.name}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Código interno
            </th>
            <td className="px-2">{item.code}</td>
          </tr>
        </tbody>
      </Table>

      <h6 className="my-2">
        Historial de cambios de estado
        <span className="small mx-1 fw-normal fst-italic">
          (más recientes primero)
        </span>
      </h6>

      {item.evolutions.length === 0 ? (
        <p className="text-muted fst-italic small">
          No se han registrado cambios de estado
        </p>
      ) : (
        <ListGroup className="small mb-3">
          {item.evolutions.map((evolution) => (
            <ListGroup.Item key={evolution.id}>
              <Row>
                <Col xs={12} lg={7}>
                  <b>{DayJsAdapter.toDayMonthYearHour(evolution.at)}</b>
                  {" - "}
                  {evolution.user} marcó el artículo como{" "}
                  <span
                    style={{
                      fontSize: ".9em",
                      backgroundColor:
                        InventoryStatus[evolution.status] || "gray",
                      color: "black",
                    }}
                    className="badge rounded-pill"
                  >
                    {evolution.status}
                  </span>
                </Col>
                <Col xs={12} lg={5}>
                  {evolution.comment && (
                    <span className="text-muted fst-italic">
                      <i className="bi bi-chat-right-text me-1"></i>{" "}
                      {evolution.comment}
                    </span>
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
};
