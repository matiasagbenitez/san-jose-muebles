import { Button, Col, Row, InputGroup } from "react-bootstrap";
import { NumericFormat } from "react-number-format";

export const PurchaseResume = ({
  push,
  values,
  setFieldValue,
  isFormSubmitted,
}: any) => {
  return (
    <>
      <Row className="mb-1" style={{ height: "" }}>
        <Col xs={2} className="small mt-1">
          <Button
            title="Agregar un nuevo producto al detalle"
            className="py-1 w-100"
            variant="success"
            size="sm"
            onClick={() =>
              push({
                quantity: 1,
                id_product: "",
                price: 0,
                subtotal: 0,
              })
            }
          >
            <i className="bi bi-plus-circle"></i>
            &ensp; Agregar producto
          </Button>
        </Col>
        <Col xs={8} className="small mt-1 text-end text-uppercase">
          <b>Subtotal *</b>
        </Col>
        <Col xs={2}>
          <InputGroup className="mb-3" size="sm">
            <InputGroup.Text>$</InputGroup.Text>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              className="form-control text-end"
              value={
                (values.subtotal =
                  Math.round(
                    values.products_list.reduce(
                      (acc: number, product: any) => acc + product.subtotal,
                      0
                    ) * 100
                  ) / 100)
              }
              disabled
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-1 text-end" style={{ height: "" }}>
        <Col xs={10} className="small mt-1">
          <i>Descuento</i>
        </Col>
        <Col xs={2}>
          <InputGroup className="mb-3" size="sm">
            <InputGroup.Text>- $</InputGroup.Text>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              className="form-control text-end"
              onValueChange={(values: any) => {
                setFieldValue(`discount`, values.floatValue);
                setFieldValue(
                  `total`,
                  Math.round((values.subtotal - values.floatValue) * 100) / 100
                );
              }}
              value={values.discount}
              min={0}
              max={values.subtotal}
              defaultValue={0}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-1 text-end" style={{ height: "" }}>
        <Col xs={10} className="small mt-1">
          <i>
            Otros cargos &ensp;
            <i
              className="bi bi-info-circle"
              title="Cargos adicionales que deben ser pagados AL PROVEEDOR (flete a cargo del proveedor, seguros, impuestos, etc.)"
            ></i>
          </i>
        </Col>
        <Col xs={2}>
          <InputGroup className="mb-3" size="sm">
            <InputGroup.Text>$</InputGroup.Text>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              className="form-control text-end"
              onValueChange={(values: any) => {
                setFieldValue(`other_charges`, values.floatValue);
                setFieldValue(
                  `total`,
                  Math.round(
                    (values.subtotal - values.discount + values.floatValue) *
                      100
                  ) / 100
                );
              }}
              value={values.other_charges}
              min={0}
              defaultValue={0}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-1 text-end" style={{ height: "" }}>
        <Col xs={10} className="small mt-1 d-flex justify-content-between">
          <small>(*) Los campos marcados con asterisco son requeridos</small>
          <b className="text-uppercase">Total a pagar al proveedor *</b>
        </Col>
        <Col xs={2}>
          <InputGroup className="mb-3" size="sm">
            <InputGroup.Text>$</InputGroup.Text>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              className="form-control text-end"
              value={
                (values.total =
                  Math.round(
                    (values.subtotal - values.discount + values.other_charges) *
                      100
                  ) / 100)
              }
              disabled
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="text-end" style={{ height: "" }}>
        <Col xs={10}></Col>

        <Col xs={2}>
          <Button
            title="Registrar la compra"
            type="submit"
            variant="primary"
            className="w-100"
            size="sm"
            disabled={isFormSubmitted}
          >
            <i className="bi bi-floppy"></i>
            &ensp; Registrar compra
          </Button>
        </Col>
      </Row>
    </>
  );
};
