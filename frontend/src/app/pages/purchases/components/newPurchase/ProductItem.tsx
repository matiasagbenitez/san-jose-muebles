import React from "react";

import { Button, Col, Form as FormRB, InputGroup, Row } from "react-bootstrap";
import Select from "react-select";

interface ProductItemProps {
  index: number;
  products: any;
  values: any;
  setFieldValue: any;
  remove: any;
}

export const ProductItem = ({
  index,
  products,
  values,
  setFieldValue,
  remove,
}: ProductItemProps) => {
  return (
    <Row key={index} className="mb-1" style={{ height: "" }}>
      <Col xs={1}>
        <Button
          variant="danger"
          className="p-0 -0 text-white w-100"
          style={{ height: "31px" }}
          title="Eliminar ítem"
          onClick={() => {
            remove(index);
          }}
        >
          <i className="bi bi-x-circle-fill small"></i>
        </Button>
      </Col>
      <Col xs={1}>
        <InputGroup className="mb-3" size="sm">
          <FormRB.Control
            className="text-end"
            type="number"
            name={`products_list.${index}.quantity`}
            value={values.products_list[index].quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!isNaN(parseFloat(e.target.value))) {
                const quantity = parseFloat(e.target.value);
                setFieldValue(`products_list.${index}.quantity`, quantity);
                const price = values.products_list[index].price;
                const subtotal = price * quantity;
                setFieldValue(
                  `products_list.${index}.subtotal`,
                  Math.round(subtotal * 100) / 100
                );
              } else {
                setFieldValue(`products_list.${index}.quantity`, "");
                setFieldValue(`products_list.${index}.subtotal`, "");
              }
            }}
            step="0.01"
            min={1}
            required
          />
        </InputGroup>
      </Col>
      <Col xs={6}>
        <Select
          placeholder="Seleccione un producto"
          name={`products_list.${index}.id_product`}
          options={products}
          onChange={(e: any) => {
            setFieldValue(`products_list.${index}.id_product`, e.id);
          }}
          styles={{
            control: (_provided, _state) => ({
              height: "31px",
              minHeight: "31px",
              border: "1px solid #ced4da",
              borderRadius: "0.25rem",
              fontSize: "0.9rem",
              display: "flex",
            }),
            menu: (provided, _state) => ({
              ...provided,
              fontSize: "0.9rem",
            }),
          }}
          getOptionValue={(option) => option.id}
          required
        />
      </Col>
      <Col xs={2}>
        <InputGroup className="mb-3" size="sm">
          <InputGroup.Text>$</InputGroup.Text>
          <FormRB.Control
            value={values.products_list[index].price}
            className="text-end"
            type="number"
            name={`products_list.${index}.price`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!isNaN(parseFloat(e.target.value))) {
                const price = parseFloat(e.target.value);
                setFieldValue(`products_list.${index}.price`, price);
                const quantity = values.products_list[index].quantity;
                const subtotal = price * quantity;
                setFieldValue(
                  `products_list.${index}.subtotal`,
                  Math.round(subtotal * 100) / 100
                );
              } else {
                setFieldValue(`products_list.${index}.price`, "");
                setFieldValue(`products_list.${index}.subtotal`, "");
              }
            }}
            step="0.01"
            min={1}
            required
          />
        </InputGroup>
      </Col>
      <Col xs={2} className="d-flex gap-2">
        <InputGroup className="mb-3" size="sm">
          <InputGroup.Text>$</InputGroup.Text>
          <FormRB.Control
            className="text-end"
            type="number"
            name={`products_list.${index}.subtotal`}
            disabled
            value={values.products_list[index].subtotal}
            step="0.01"
          />
        </InputGroup>
      </Col>
    </Row>
  );
};
