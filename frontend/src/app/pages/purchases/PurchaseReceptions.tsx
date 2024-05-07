import React, { useState, useEffect } from "react";
import { LoadingSpinner } from "../../components";
import { Row, Col, Table, InputGroup, Form, Button } from "react-bootstrap";
import apiSJM from "../../../api/apiSJM";
import { useNavigate, useParams } from "react-router-dom";
import {
  ReceptionDataInterface,
  ProductReceptionInterface,
  PurchaseReceptionInterface,
} from "./interfaces";
import { DayJsAdapter } from "../../../helpers";

export const PurchaseReceptions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [purchaseData, setPurchaseData] = useState<ReceptionDataInterface>();
  const [partials, setPartials] = useState<ProductReceptionInterface[]>();
  const [total, setTotal] = useState<PurchaseReceptionInterface | null>();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/purchases/${id}/receptions`);
      setPurchaseData(data.purchaseData);
      setPartials(data.partials);
      setTotal(data.total);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && purchaseData && (
        <div>
          <div className="d-flex gap-3 align-items-center">
            <Button
              variant="light border text-muted"
              size="sm"
              onClick={() => navigate(`/compras/${id}`)}
              title="Volver a la compra"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Atrás
            </Button>
            <h2 className="fs-5 my-0">
              Compra #{purchaseData.id} - Registros de recepción de productos
            </h2>
          </div>
          <hr />
          <Row>
            <Col xs={12} md={6} xl={3}>
              <InputGroup className="mb-3" size="sm">
                <InputGroup.Text>Proveedor</InputGroup.Text>
                <Form.Control disabled value={purchaseData.supplier} />
              </InputGroup>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <InputGroup className="mb-3" size="sm">
                <InputGroup.Text>Fecha de compra</InputGroup.Text>
                <Form.Control type="date" disabled value={purchaseData.date} />
              </InputGroup>
            </Col>
          </Row>
          <hr className="mt-0" />
          <h3 className="fs-6 mt-2">Recepciones parciales de productos</h3>
          {partials && partials.length > 0 ? (
            <Table striped bordered size="sm" className="small" responsive>
              <thead className="text-uppercase text-center">
                <tr>
                  <th colSpan={2}>DATOS DE LA COMPRA</th>
                  <th colSpan={3}>RESUMEN DE RECEPCIONES</th>
                </tr>
                <tr>
                  <th className="col-1">Cantidad</th>
                  <th className="col-5">Producto</th>
                  <th className="col-2">Usuario</th>
                  <th className="col-2">Cantidad recibida</th>
                  <th className="col-2">Fecha registro</th>
                </tr>
              </thead>
              <tbody>
                {partials.map((partial) => (
                  <React.Fragment key={partial.prod}>
                    {partial.recep.map((reception, index) => (
                      <tr key={reception.id}>
                        {index === 0 && (
                          <>
                            <td
                              rowSpan={partial.recep.length}
                              className="text-center align-middle"
                            >
                              {partial.quant}
                            </td>
                            <td
                              rowSpan={partial.recep.length}
                              className="align-middle"
                            >
                              {partial.prod}
                            </td>
                          </>
                        )}
                        <td className="text-center">{reception.user}</td>
                        <td className="text-center">{reception.quant}</td>
                        <td className="text-center">
                          {DayJsAdapter.toDayMonthYearHour(reception.date)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted small">
              No hay registros de recepciones parciales de productos
            </p>
          )}

          <h3 className="fs-6 mt-2">Recepción total de la compra</h3>
          {total ? (
            <p className="text-muted small">
              La recepción total de la compra fue registrada el día{" "}
              {DayJsAdapter.toDayMonthYearHour(total.date)} por el usuario{" "}
              {total.user}
              <i className="bi bi-check-circle-fill fs-6 mx-1 text-success"></i>
            </p>
          ) : (
            <p className="text-muted small">
              No se utilizó la opción de recepción total de la compra
            </p>
          )}

          {/* <Button
            variant="light border text-muted"
            size="sm"
            onClick={() => navigate(`/compras/${id}`)}
            title="Volver a la compra"
          >
            <i className="bi bi-arrow-return-left me-2"></i>
            Atrás
          </Button> */}
        </div>
      )}
    </>
  );
};
