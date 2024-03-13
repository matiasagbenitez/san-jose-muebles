import React from "react";
import { Button, Col, Row, InputGroup, Form as FormRB } from "react-bootstrap";

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
        <Col xs={8} className="small mt-1 text-end">
          <b>Subtotal productos</b>
        </Col>
        <Col xs={2}>
          <InputGroup className="mb-3" size="sm">
            <InputGroup.Text>$</InputGroup.Text>
            <FormRB.Control
              min={1}
              autoComplete="off"
              className="text-end"
              type="number"
              name={`subtotal`}
              disabled
              value={
                (values.subtotal = values.products_list.reduce(
                  (acc: any, item: any) => acc + item.subtotal,
                  0
                ))
              }
              step="0.01"
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
            <FormRB.Control
              min={0}
              autoComplete="off"
              className="text-end"
              type="number"
              name={`discount`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!isNaN(parseFloat(e.target.value))) {
                  const discount = parseFloat(e.target.value);
                  setFieldValue(`discount`, discount);
                  setFieldValue(
                    `total`,
                    Math.round((values.subtotal - discount) * 100) / 100
                  );
                } else {
                  setFieldValue(`discount`, 0);
                }
              }}
              step="0.01"
              defaultValue={0}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-1 text-end" style={{ height: "" }}>
        <Col xs={10} className="small mt-1">
          <i>Envío (flete)</i>
        </Col>
        <Col xs={2}>
          <InputGroup className="mb-3" size="sm">
            <InputGroup.Text>$</InputGroup.Text>
            <FormRB.Control
              min={0}
              autoComplete="off"
              className="text-end"
              type="number"
              name={`shipping`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!isNaN(parseFloat(e.target.value))) {
                  const shipping = parseFloat(e.target.value);
                  setFieldValue(`shipping`, shipping);
                  setFieldValue(
                    `total`,
                    Math.round(
                      (values.subtotal - values.discount + shipping) * 100
                    ) / 100
                  );
                } else {
                  setFieldValue(`shipping`, 0);
                }
              }}
              step="0.01"
              defaultValue={0}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-1 text-end" style={{ height: "" }}>
        <Col xs={10} className="small mt-1">
          <i>Impuestos adicionales</i>
        </Col>
        <Col xs={2}>
          <InputGroup className="mb-3" size="sm">
            <InputGroup.Text>$</InputGroup.Text>
            <FormRB.Control
              min={0}
              autoComplete="off"
              className="text-end"
              type="number"
              name={`fees`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!isNaN(parseFloat(e.target.value))) {
                  const fees = parseFloat(e.target.value);
                  setFieldValue(`fees`, fees);
                  setFieldValue(
                    `total`,
                    Math.round(
                      (values.subtotal -
                        values.discount +
                        values.shipping +
                        fees) *
                        100
                    ) / 100
                  );
                } else {
                  setFieldValue(`fees`, 0);
                }
              }}
              step="0.01"
              defaultValue={0}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-1 text-end" style={{ height: "" }}>
        <Col xs={10} className="small mt-1">
          <b className="text-uppercase">Total compra</b>
        </Col>
        <Col xs={2}>
          <InputGroup className="mb-3" size="sm">
            <InputGroup.Text>$</InputGroup.Text>
            <FormRB.Control
              min={1}
              autoComplete="off"
              className="text-end"
              type="number"
              name={`total`}
              disabled
              value={
                (values.total =
                  (values.subtotal -
                    values.discount +
                    values.shipping +
                    values.fees) *
                  100) / 100
              }
              step="0.01"
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="text-end" style={{ height: "" }}>
        <Col xs={10}></Col>

        <Col xs={2}>
          <Button
            title="Guardar la compra"
            type="submit"
            variant="primary"
            className="w-100"
            size="sm"
            disabled={isFormSubmitted}
          >
            <i className="bi bi-floppy"></i>
            &ensp; Guardar
          </Button>
        </Col>
      </Row>
    </>
  );
};
