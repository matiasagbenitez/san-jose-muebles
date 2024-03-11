import React, { useState, useEffect } from "react";
import { Button, Col, Row, InputGroup, Form as FormRB } from "react-bootstrap";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../../api/apiSJM";
import { MySelect, MyInputDate } from "../../../components/forms";

interface CurrencyInterface {
  id: string;
  name: string;
}

interface SupplierInterface {
  id: string;
  name: string;
  locality: string;
}

interface ProductItemInterface {
  id_product: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface ProductFormInterface {
  id_supplier: string;
  id_currency: string;
  date: string;
  products_list: ProductItemInterface[];
  subtotal: number;
  discount: number;
  shipping: number;
  fees: number;
  total: number;
}

interface ProductInterface {
  id: string;
  brand: string;
  name: string;
  code: string;
}

const initialForm: ProductFormInterface = {
  id_supplier: "1",
  id_currency: "1",
  date: "2024-10-10",
  products_list: [
    {
      quantity: 1,
      id_product: "",
      price: 0,
      subtotal: 0,
    },
  ],
  subtotal: 0,
  discount: 0,
  shipping: 0,
  fees: 0,
  total: 0,
};

interface FormProps {
  onSubmit: (values: any) => void;
  isFormSubmitted?: boolean;
}

export const NewPurchaseForm = ({ onSubmit, isFormSubmitted }: FormProps) => {
  const [currencies, setCurrencies] = useState<CurrencyInterface[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierInterface[]>([]);
  const [products, setProducts] = useState<ProductInterface[]>([]);

  const fetch = async () => {
    const [res1, res2, res3] = await Promise.all([
      apiSJM.get("/currencies"),
      apiSJM.get("/suppliers/select"),
      apiSJM.get("/products"),
    ]);
    setCurrencies(res1.data.items);
    setSuppliers(res2.data.items);
    setProducts(res3.data.items);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <Formik
        initialValues={initialForm}
        onSubmit={(values) => {
          console.log(values);
          onSubmit(values);
        }}
        validationSchema={Yup.object({
          date: Yup.date().required("La fecha es requerida"),
          id_supplier: Yup.string().required("El proveedor es requerido"),
          id_currency: Yup.string().required("La moneda es requerida"),
          products_list: Yup.array()
            .of(
              Yup.object().shape({
                quantity: Yup.number()
                  .moreThan(0, "Revisar")
                  .required("La cantidad es requerida"),
                id_product: Yup.number().required("El producto es requerido"),
                price: Yup.number()
                  .moreThan(0, "Revisar")
                  .required("El precio es requerido"),
                subtotal: Yup.number()
                  .moreThan(0, "Revisar cantidad y precio")
                  .required("El subtotal es requerido"),
              })
            )
            .min(1, "Debe agregar al menos un producto"),
          subtotal: Yup.number().moreThan(0, "Revisar").required("Revisar"),
          total: Yup.number().moreThan(0, "Revisar").required("Revisar"),
        })}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form id="form">
            <Row>
              <Col xxl={3} className="mb-4">
                <h2 className="fs-6">Información general</h2>
                <MySelect
                  label="Proveedor *"
                  name="id_supplier"
                  as="select"
                  isInvalid={!!errors.id_supplier && touched.id_supplier}
                >
                  <option value="">Seleccione una opción</option>
                  {suppliers &&
                    suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name} ({supplier.locality})
                      </option>
                    ))}
                </MySelect>
                <MySelect
                  label="Moneda de compra *"
                  name="id_currency"
                  as="select"
                  isInvalid={!!errors.id_currency && touched.id_currency}
                >
                  <option value="">Seleccione una opción</option>
                  {currencies &&
                    currencies.map((currency) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.name}
                      </option>
                    ))}
                </MySelect>
                <MyInputDate label="Fecha *" name="date" />
              </Col>

              <Col xxl={9}>
                <h2 className="fs-6 mt-3 mt-lg-0">Detalle de la compra</h2>
                <Row className="small mb-1 text-">
                  <Col xs={2}>
                    <label>&ensp;X&ensp;| Cantidad</label>
                  </Col>
                  <Col xs={6}>
                    <label>Producto</label>
                  </Col>
                  <Col xs={2}>
                    <label>Precio</label>
                  </Col>
                  <Col xs={2}>
                    <label>Subtotal</label>
                  </Col>
                </Row>

                <FieldArray name="products_list">
                  {({ remove, push }) => (
                    <>
                      {values.products_list.map((_product, index) => (
                        <div key={index}>
                          <Row key={index}>
                            <Col xs={2} className="d-flex gap-1">
                              <Button
                                variant="transparent text-danger"
                                className="px-1 py-0"
                                style={{ height: "31px" }}
                                title="Eliminar ítem"
                                onClick={() => {
                                  remove(index);
                                }}
                              >
                                <i className="bi bi-x-circle-fill fs-6"></i>
                              </Button>

                              <InputGroup className="mb-3" size="sm">
                                <FormRB.Control
                                  className="text-end"
                                  type="number"
                                  name={`products_list.${index}.quantity`}
                                  value={values.products_list[index].quantity}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    if (!isNaN(parseFloat(e.target.value))) {
                                      const quantity = parseFloat(
                                        e.target.value
                                      );
                                      setFieldValue(
                                        `products_list.${index}.quantity`,
                                        quantity
                                      );
                                      const price =
                                        values.products_list[index].price;
                                      const subtotal = price * quantity;
                                      setFieldValue(
                                        `products_list.${index}.subtotal`,
                                        Math.round(subtotal * 100) / 100
                                      );
                                    } else {
                                      setFieldValue(
                                        `products_list.${index}.quantity`,
                                        ""
                                      );
                                      setFieldValue(
                                        `products_list.${index}.subtotal`,
                                        ""
                                      );
                                    }
                                  }}
                                  step="0.01"
                                  defaultValue={1}
                                  min={1}
                                  required
                                />
                              </InputGroup>
                            </Col>
                            <Col xs={6}>
                              <FormRB.Select
                                size="sm"
                                name={`products_list.${index}.id_product`}
                                value={values.products_list[index].id_product}
                                onChange={(
                                  e: React.ChangeEvent<HTMLSelectElement>
                                ) => {
                                  setFieldValue(
                                    `products_list.${index}.id_product`,
                                    e.target.value
                                  );
                                }}
                                required
                              >
                                <option value="">Seleccione una opción</option>
                                {products &&
                                  products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                      {product.brand} | {product.name} &nbsp;
                                      COD: {product.code}
                                    </option>
                                  ))}
                              </FormRB.Select>
                            </Col>
                            <Col xs={2}>
                              <InputGroup className="mb-3" size="sm">
                                <InputGroup.Text>$</InputGroup.Text>
                                <FormRB.Control
                                  value={values.products_list[index].price}
                                  className="text-end"
                                  type="number"
                                  name={`products_list.${index}.price`}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    if (!isNaN(parseFloat(e.target.value))) {
                                      const price = parseFloat(e.target.value);
                                      setFieldValue(
                                        `products_list.${index}.price`,
                                        price
                                      );
                                      const quantity =
                                        values.products_list[index].quantity;
                                      const subtotal = price * quantity;
                                      setFieldValue(
                                        `products_list.${index}.subtotal`,
                                        Math.round(subtotal * 100) / 100
                                      );
                                    } else {
                                      setFieldValue(
                                        `products_list.${index}.price`,
                                        ""
                                      );
                                      setFieldValue(
                                        `products_list.${index}.subtotal`,
                                        ""
                                      );
                                    }
                                  }}
                                  step="0.01"
                                  defaultValue={0}
                                  min={1}
                                />
                              </InputGroup>
                            </Col>
                            <Col xs={2}>
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
                        </div>
                      ))}
                      <Button
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
                        Agregar producto
                      </Button>
                      <hr />

                      <Row>
                        <Col xs={10} className="text-end small mt-1">
                          <b>Subtotal</b>
                        </Col>
                        <Col xs={2} className=" text-end">
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
                                  (acc, item) => acc + item.subtotal,
                                  0
                                ))
                              }
                              step="0.01"
                            />
                          </InputGroup>
                        </Col>
                        <Col xs={10} className="text-end small mt-1">
                          <i>Descuento</i>
                        </Col>
                        <Col xs={2} className=" text-end">
                          <InputGroup className="mb-3" size="sm">
                            <InputGroup.Text>- $</InputGroup.Text>
                            <FormRB.Control
                              min={0}
                              autoComplete="off"
                              className="text-end"
                              type="number"
                              name={`discount`}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                if (!isNaN(parseFloat(e.target.value))) {
                                  const discount = parseFloat(e.target.value);
                                  setFieldValue(`discount`, discount);
                                  setFieldValue(
                                    `total`,
                                    Math.round(
                                      (values.subtotal - discount) * 100
                                    ) / 100
                                  );
                                } else {
                                  setFieldValue(`discount`, "");
                                  setFieldValue(`total`, "");
                                }
                              }}
                              step="0.01"
                              defaultValue={0}
                            />
                          </InputGroup>
                        </Col>
                        <Col xs={10} className="text-end small mt-1">
                          <i>Envío (flete)</i>
                        </Col>
                        <Col xs={2} className=" text-end">
                          <InputGroup className="mb-3" size="sm">
                            <InputGroup.Text>$</InputGroup.Text>
                            <FormRB.Control
                              min={0}
                              autoComplete="off"
                              className="text-end"
                              type="number"
                              name={`shipping`}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                if (!isNaN(parseFloat(e.target.value))) {
                                  const shipping = parseFloat(e.target.value);
                                  setFieldValue(`shipping`, shipping);
                                  setFieldValue(
                                    `total`,
                                    Math.round(
                                      (values.subtotal -
                                        values.discount +
                                        shipping) *
                                        100
                                    ) / 100
                                  );
                                } else {
                                  setFieldValue(`shipping`, "");
                                  setFieldValue(`total`, "");
                                }
                              }}
                              step="0.01"
                              defaultValue={0}
                            />
                          </InputGroup>
                        </Col>
                        <Col xs={10} className="text-end small mt-1">
                          <i>Impuestos adicionales</i>
                        </Col>
                        <Col xs={2} className=" text-end">
                          <InputGroup className="mb-3" size="sm">
                            <InputGroup.Text>$</InputGroup.Text>
                            <FormRB.Control
                              min={0}
                              autoComplete="off"
                              className="text-end"
                              type="number"
                              name={`fees`}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
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
                                  setFieldValue(`fees`, "");
                                  setFieldValue(`total`, "");
                                }
                              }}
                              step="0.01"
                              defaultValue={0}
                            />
                          </InputGroup>
                        </Col>
                        <Col xs={10} className="text-end small mt-1">
                          <b className="text-uppercase">Total</b>
                        </Col>
                        <Col xs={2} className=" text-end">
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
                                  values.subtotal -
                                  values.discount +
                                  values.shipping +
                                  values.fees)
                              }
                              step="0.01"
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                    </>
                  )}
                </FieldArray>
              </Col>
            </Row>

            <Button
              type="submit"
              variant="primary"
              className="mt-3 float-end"
              size="sm"
              disabled={isFormSubmitted}
            >
              Guardar
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};
