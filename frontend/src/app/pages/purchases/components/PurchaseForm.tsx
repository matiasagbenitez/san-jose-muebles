import { useState, useEffect } from "react";
import { Col, InputGroup, Row, Form as FormRB } from "react-bootstrap";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../../api/apiSJM";
import { ProductItem, PurchaseResume } from ".";
import { LoadingSpinner } from "../../../components";

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
  other_charges: number;
  total: number;
}

const initialForm: ProductFormInterface = {
  id_supplier: "",
  id_currency: "1",
  date: new Date().toISOString().split("T")[0],
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
  other_charges: 0,
  total: 0,
};

interface FormProps {
  onSubmit: (values: any) => void;
  isFormSubmitting: boolean;
}

export const PurchaseForm = ({ onSubmit, isFormSubmitting }: FormProps) => {
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const fetch = async () => {
    setLoading(true);
    const [res1, res2, res3] = await Promise.all([
      apiSJM.get("/currencies/monetaries"),
      apiSJM.get("/suppliers/select"),
      apiSJM.get("/products"),
    ]);
    setCurrencies(res1.data.items);
    setSuppliers(res2.data.items);
    setProducts(res3.data.items);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Formik
          initialValues={initialForm}
          onSubmit={(values) => {
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
            discount: Yup.number().min(0, "Revisar").required("Revisar"),
            other_charges: Yup.number().min(0, "Revisar").required("Revisar"),
            total: Yup.number().moreThan(0, "Revisar").required("Revisar"),
          })}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form id="form">
              <Row>
                <p className="mb-3 text-muted small">Para registrar una nueva compra, complete los siguientes campos del formulario:</p>
                <Col xs={12} lg={2}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="from">Fecha compra *</InputGroup.Text>
                    <FormRB.Control
                      type="date"
                      name="date"
                      isInvalid={!!errors.date && touched.date}
                      value={values.date}
                      onChange={(e: any) => {
                        setFieldValue("date", e.target.value);
                      }}
                      required
                      disabled={isFormSubmitting}
                    />
                  </InputGroup>
                </Col>
                <Col xs={12} lg={6}>
                  <InputGroup size="sm" className="mb-3" hasValidation>
                    <InputGroup.Text id="from">Proveedor *</InputGroup.Text>
                    <FormRB.Select
                      name="id_supplier"
                      size="sm"
                      isInvalid={!!errors.id_supplier && touched.id_supplier}
                      value={values.id_supplier}
                      onChange={(e: any) => {
                        setFieldValue("id_supplier", e.target.value);
                      }}
                      required
                      disabled={isFormSubmitting}
                    >
                      <option value="">Seleccione una opción</option>
                      {suppliers &&
                        suppliers.map((supplier: any) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name} ({supplier.locality})
                          </option>
                        ))}
                    </FormRB.Select>
                  </InputGroup>
                </Col>
                <Col xs={12} lg={4}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="from">Moneda de compra *</InputGroup.Text>
                    <FormRB.Select
                      name="id_currency"
                      size="sm"
                      isInvalid={!!errors.id_currency && touched.id_currency}
                      value={values.id_currency}
                      onChange={(e: any) => {
                        setFieldValue("id_currency", e.target.value);
                      }}
                      required
                      disabled={isFormSubmitting}
                    >
                      <option value="">Seleccione una opción</option>
                      {currencies &&
                        currencies.map((currency: any) => (
                          <option key={currency.id} value={currency.id}>
                            {currency.name}
                          </option>
                        ))}
                    </FormRB.Select>
                  </InputGroup>

                </Col>
              </Row>

              <FieldArray name="products_list">
                {({ remove, push }) => (
                  <>
                   <p className="mb-2 small fw-bold">Productos comprados</p>

                    {values.products_list.length > 0 ? (
                      <Row className="small mb-1 text-uppercase">
                        <Col xs={1}>
                          <small>Eliminar ítem</small>
                        </Col>
                        <Col xs={1}>
                          <small>Cantidad *</small>
                        </Col>
                        <Col xs={6}>
                          <small>Producto *</small>
                        </Col>
                        <Col xs={2}>
                          <small>Precio *</small>
                        </Col>
                        <Col xs={2}>
                          <small>Subtotal producto *</small>
                        </Col>
                      </Row>
                    ) : (
                      <p className="small text-danger">
                        Debe agregar al menos un producto
                      </p>
                    )}

                    {values.products_list.map((_product, index) => (
                      <ProductItem
                        key={index}
                        index={index}
                        remove={remove}
                        products={products}
                        setFieldValue={setFieldValue}
                        values={values}
                        isFormSubmitting={isFormSubmitting}
                      />
                    ))}

                    {values.products_list.length > 0 && (
                      <PurchaseResume
                        push={push}
                        values={values}
                        setFieldValue={setFieldValue}
                        isFormSubmitting={isFormSubmitting}
                      />
                    )}
                  </>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};
