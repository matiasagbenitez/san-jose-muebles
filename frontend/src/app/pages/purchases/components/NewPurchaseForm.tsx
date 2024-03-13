import { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../../api/apiSJM";
import { MySelect, MyInputDate } from "../../../components/forms";
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
  isFormSubmitted?: boolean;
}

export const NewPurchaseForm = ({ onSubmit, isFormSubmitted }: FormProps) => {
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const fetch = async () => {
    setLoading(true);
    const [res1, res2, res3] = await Promise.all([
      apiSJM.get("/currencies"),
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
                <h2 className="fs-6 mt-0">Información general</h2>
                <Col xs={12} lg={2}>
                  <MyInputDate label="Fecha *" name="date" />
                </Col>
                <Col xs={12} lg={6}>
                  <MySelect
                    label="Proveedor *"
                    name="id_supplier"
                    as="select"
                    isInvalid={!!errors.id_supplier && touched.id_supplier}
                  >
                    <option value="">Seleccione una opción</option>
                    {suppliers &&
                      suppliers.map((supplier: any) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name} ({supplier.locality})
                        </option>
                      ))}
                  </MySelect>
                </Col>
                <Col xs={12} lg={4}>
                  <MySelect
                    label="Moneda de compra *"
                    name="id_currency"
                    as="select"
                    isInvalid={!!errors.id_currency && touched.id_currency}
                  >
                    <option value="">Seleccione una opción</option>
                    {currencies &&
                      currencies.map((currency: any) => (
                        <option key={currency.id} value={currency.id}>
                          {currency.name}
                        </option>
                      ))}
                  </MySelect>
                </Col>
              </Row>

              <FieldArray name="products_list">
                {({ remove, push }) => (
                  <>
                    <Row className="my-3">
                      <h2 className="fs-6 mt-0 mb-0">Detalle de la compra</h2>
                    </Row>

                    {values.products_list.length > 0 ? (
                      <Row className="small mb-1">
                        <Col xs={1}>
                          <span>Eliminar</span>
                        </Col>
                        <Col xs={1}>
                          <span>Cantidad *</span>
                        </Col>
                        <Col xs={6}>
                          <span>Producto *</span>
                        </Col>
                        <Col xs={2}>
                          <span>Precio *</span>
                        </Col>
                        <Col xs={2}>
                          <span>Subtotal producto *</span>
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
                      />
                    ))}

                    {values.products_list.length > 0 && (
                      <PurchaseResume
                        push={push}
                        values={values}
                        setFieldValue={setFieldValue}
                        isFormSubmitted={isFormSubmitted}
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
