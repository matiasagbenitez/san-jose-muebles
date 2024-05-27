import { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import apiSJM from "../../../../api/apiSJM";
import { LoadingSpinner, CustomInput } from "../../../components";
import { CurrencyInterface } from "../../projects/interfaces";
import { SweetAlert2 } from "../../../utils";

interface ProductItemInterface {
  id_product: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface PuchaseFormInterface {
  id_supplier: string;
  id_currency: string;
  date: string;
  products_list: ProductItemInterface[];
  subtotal: number;
  discount: number;
  other_charges: number;
  total: number;

  percent_discount: number;
  percent_other_charges: number;
}

const initialForm: PuchaseFormInterface = {
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

  percent_discount: 0,
  percent_other_charges: 0,
};

export const PurchaseForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState<CurrencyInterface[]>([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formValues, setFormValues] = useState<PuchaseFormInterface | null>(
    null
  );

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyInterface>();
  const [prefix, setPrefix] = useState<string>("");

  const [confirmation, setConfirmation] = useState(false);

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

  useEffect(() => {
    setSelectedCurrency(currencies[0]);
  }, [currencies]);

  useEffect(() => {
    if (selectedCurrency) {
      const aux = `${selectedCurrency.symbol} ${
        selectedCurrency.is_monetary ? "$" : ""
      }`;
      setPrefix(aux);
    } else {
      setPrefix("");
    }
  }, [selectedCurrency]);

  const handleSubmit = (values: PuchaseFormInterface) => {
    setIsFormSubmitted(true);
    setFormValues(values);
    setConfirmation(true);
  };

  const abortSubmit = () => {
    setIsFormSubmitted(false);
    setConfirmation(false);
  };

  const confirmSubmit = async () => {
    try {
      const confirmation = await SweetAlert2.confirm(
        "¿Desea registrar la compra?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post("/purchases", formValues);
      console.log(data);
      SweetAlert2.successToast(data.message);
      navigate(`/compras/${data.id}`);
    } catch (error: any) {
      console.log(error.response.data.message);
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitted(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Formik
          initialValues={initialForm}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validationSchema={Yup.object({
            date: Yup.date().required("La fecha es requerida"),
            id_supplier: Yup.string().required("El proveedor es requerido"),
            id_currency: Yup.string().required("La moneda es requerida"),
            products_list: Yup.array()
              .of(
                Yup.object().shape({
                  quantity: Yup.number()
                    .required("La cantidad es requerida")
                    .moreThan(0, "Revisar"),
                  id_product: Yup.number().required("El producto es requerido"),
                  price: Yup.number()
                    .required("El precio es requerido")
                    .moreThan(0, "Revisar"),
                  subtotal: Yup.number()
                    .required("El subtotal es requerido")
                    .moreThan(0, "Revisar cantidad y precio"),
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
                <p className="mb-3 text-muted small">
                  Para registrar una nueva compra, complete los siguientes
                  campos del formulario:
                </p>
                <Col xs={12} lg={2}>
                  <CustomInput.Date
                    label="Fecha de la compra"
                    name="date"
                    isInvalid={!!errors.date && touched.date}
                    disabled={isFormSubmitted}
                    isRequired
                  />
                </Col>
                <Col xs={12} lg={6}>
                  <CustomInput.Select
                    label="Proveedor al que se le compra"
                    name="id_supplier"
                    isInvalid={!!errors.id_supplier && touched.id_supplier}
                    disabled={isFormSubmitted}
                    isRequired
                  >
                    <option value="">Seleccione un proveedor</option>
                    {suppliers &&
                      suppliers.map((supplier: any) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name} ({supplier.locality})
                        </option>
                      ))}
                  </CustomInput.Select>
                </Col>
                <Col xs={12} lg={4}>
                  <CustomInput.Select
                    label="Moneda en que se realiza la compra"
                    name="id_currency"
                    isInvalid={!!errors.id_currency && touched.id_currency}
                    disabled={isFormSubmitted}
                    isRequired
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const currency = Object.values(currencies).find(
                        (currency) => currency.id == e.target.value
                      );
                      setSelectedCurrency(currency);
                      setFieldValue("id_currency", e.target.value);
                    }}
                  >
                    <option value="">Seleccione una moneda</option>
                    {currencies &&
                      currencies.map((currency: any) => (
                        <option key={currency.id} value={currency.id}>
                          {currency.name}
                        </option>
                      ))}
                  </CustomInput.Select>
                </Col>
              </Row>

              <h6 className="mt-3">Detalle de productos</h6>

              <Row>
                {/* IZQ */}
                <Col xs={2} lg={12}>
                  <Row>
                    <Col xs={12} lg={2}>
                      <Row>
                        <Col xs={12} lg={6}>
                          <label className="small mb-3 mb-lg-1">Eliminar</label>
                        </Col>
                        <Col xs={12} lg={6}>
                          <label className="small mb-3 mb-lg-1">Cantidad</label>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={12} lg={6}>
                      <label className="small mb-3 mb-lg-1">Producto</label>
                    </Col>
                    <Col xs={12} lg={2}>
                      <label className="small mb-3 mb-lg-1">Precio</label>
                    </Col>
                    <Col xs={12} lg={2}>
                      <label className="small mb-3 mb-lg-1">Subtotal</label>
                    </Col>
                  </Row>
                </Col>

                {/* DER */}
                <Col xs={10} lg={12}>
                  <FieldArray name="products_list">
                    {({ remove, push }) => {
                      const handleRemove = (index: number) => {
                        if (values.products_list.length === 1) {
                          setFieldValue("subtotal", 0);
                          setFieldValue("percent_discount", 0);
                          setFieldValue("discount", 0);
                          setFieldValue("percent_other_charges", 0);
                          setFieldValue("fees", 0);
                          setFieldValue("total", 0);
                        }
                        remove(index);
                      };

                      const handleQuantityChange = (
                        index: number,
                        quantity: number
                      ) => {
                        if (!isNaN(quantity)) {
                          setFieldValue(
                            `products_list.${index}.quantity`,
                            quantity
                          );
                          const price = values.products_list[index].price;
                          const subtotal = price * quantity;
                          setFieldValue(
                            `products_list.${index}.subtotal`,
                            subtotal
                          );
                        } else {
                          setFieldValue(`products_list.${index}.quantity`, "");
                          setFieldValue(`products_list.${index}.subtotal`, "");
                        }
                      };

                      const handlePriceChange = (
                        index: number,
                        price: number
                      ) => {
                        setFieldValue(`products_list.${index}.price`, price);
                        const quantity = values.products_list[index].quantity;
                        const subtotal = price * quantity;
                        setFieldValue(
                          `products_list.${index}.subtotal`,
                          subtotal
                        );
                      };

                      return (
                        <>
                          {values.products_list.map((_, index) => (
                            <Row key={index}>
                              <Col xs={12} lg={2}>
                                <Row>
                                  <Col xs={12} lg={6}>
                                    <Button
                                      size="sm"
                                      className="px-2 mb-2 w-100"
                                      variant="danger"
                                      onClick={() => handleRemove(index)}
                                      disabled={isFormSubmitted}
                                      style={{ height: "31px" }}
                                    >
                                      <i className="bi bi-x-circle-fill" />
                                    </Button>
                                  </Col>
                                  <Col xs={12} lg={6}>
                                    <CustomInput.Number
                                      className="text-center"
                                      name={`products_list.${index}.quantity`}
                                      value={
                                        values.products_list[index].quantity
                                      }
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        const quantity = parseFloat(
                                          e.target.value
                                        );
                                        handleQuantityChange(index, quantity);
                                      }}
                                      disabled={isFormSubmitted}
                                      isRequired
                                      required
                                    />
                                  </Col>
                                </Row>
                              </Col>

                              <Col xs={12} lg={6}>
                                <CustomInput.Select2
                                  isRequired
                                  placeholder="Seleccione un producto"
                                  name={`products_list[${index}].id_product`}
                                  options={products}
                                  onChange={(option: any) => {
                                    setFieldValue(
                                      `products_list[${index}].id_product`,
                                      option.id
                                    );
                                  }}
                                  isOptionDisabled={(option: any) =>
                                    values.products_list
                                      .map((item) => item.id_product)
                                      .includes(option.id)
                                  }
                                  isDisabled={isFormSubmitted}
                                  isInvalid={
                                    `products_list[${index}].id_product` in
                                    errors
                                  }
                                />
                              </Col>

                              <Col xs={12} lg={2}>
                                <CustomInput.Decimal
                                  name={`products_list.${index}.price`}
                                  value={values.products_list[index].price}
                                  onValueChange={(valuesLocal: any) => {
                                    const price = valuesLocal.floatValue || 0;
                                    handlePriceChange(index, price);
                                  }}
                                  disabled={isFormSubmitted}
                                  isRequired
                                  prefix={prefix}
                                  required
                                  min={1}
                                />
                              </Col>

                              <Col xs={12} lg={2}>
                                <CustomInput.Decimal
                                  name={`products_list.${index}.subtotal`}
                                  value={values.products_list[index].subtotal}
                                  isRequired
                                  disabled
                                  prefix={prefix}
                                  required
                                />
                              </Col>
                            </Row>
                          ))}

                          <Row>
                            <Col xs={12} lg={2}>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() =>
                                  push({
                                    quantity: 1,
                                    id_product: "",
                                    price: 0,
                                    subtotal: 0,
                                  })
                                }
                                disabled={
                                  isFormSubmitted ||
                                  values.products_list.some(
                                    (item) => item.id_product === ""
                                  )
                                }
                                className="w-100 mb-2"
                              >
                                <i className="bi bi-plus-circle"></i>
                                &ensp; Agregar item
                              </Button>
                            </Col>
                            {values.products_list.length > 0 && (
                              <>
                                <Col xs={12} lg={8}>
                                  <p className="mt-1 mb-0 small text-start text-lg-end">
                                    <b>Subtotal</b>
                                  </p>
                                </Col>
                                <Col xs={12} lg={2}>
                                  <CustomInput.Decimal
                                    name="subtotal"
                                    value={
                                      (values.subtotal =
                                        values.products_list.reduce(
                                          (acc, item) => acc + item.subtotal,
                                          0
                                        ))
                                    }
                                    disabled
                                    isRequired
                                    prefix={prefix}
                                    required
                                  />
                                </Col>
                                <Col xs={12} lg={7}></Col>
                                <Col xs={12} lg={3}>
                                  <Row>
                                    <Col xs={6}>
                                      <p className="mt-1 mb-0 small text-start text-lg-end">
                                        <b>Descuento (%)</b>
                                      </p>
                                    </Col>
                                    <Col xs={6}>
                                      <CustomInput.Number
                                        className="text-center"
                                        name="percent_discount"
                                        value={values.percent_discount}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                          if (
                                            !isNaN(
                                              parseFloat(e.target.value)
                                            ) &&
                                            parseFloat(e.target.value) >= 0 &&
                                            parseFloat(e.target.value) <= 100
                                          ) {
                                            const percent = Math.abs(
                                              parseFloat(e.target.value)
                                            );
                                            setFieldValue(
                                              "percent_discount",
                                              percent
                                            );
                                          } else {
                                            setFieldValue(
                                              "percent_discount",
                                              0
                                            );
                                          }
                                        }}
                                        disabled={isFormSubmitted}
                                        isRequired
                                        min={0}
                                        step={0.1}
                                        max={100}
                                        required
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col xs={12} lg={2}>
                                  <CustomInput.Decimal
                                    name="discount"
                                    value={
                                      (values.discount =
                                        (values.subtotal *
                                          values.percent_discount) /
                                        100)
                                    }
                                    disabled
                                    isRequired
                                    prefix={`${prefix} - `}
                                    required
                                  />
                                </Col>

                                <Col xs={12} lg={7}></Col>
                                <Col xs={12} lg={3}>
                                  <Row>
                                    <Col xs={6}>
                                      <p className="mt-1 mb-0 small text-start text-lg-end">
                                        <b>Impuestos (%)</b>
                                      </p>
                                    </Col>
                                    <Col xs={6}>
                                      <CustomInput.Number
                                        className="text-center"
                                        name="percent_other_charges"
                                        value={values.percent_other_charges}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                          if (
                                            !isNaN(
                                              parseFloat(e.target.value)
                                            ) &&
                                            parseFloat(e.target.value) >= 0 &&
                                            parseFloat(e.target.value) <= 100
                                          ) {
                                            const percent = Math.abs(
                                              parseFloat(e.target.value)
                                            );
                                            setFieldValue(
                                              "percent_other_charges",
                                              percent
                                            );
                                          } else {
                                            setFieldValue(
                                              "percent_other_charges",
                                              0
                                            );
                                          }
                                        }}
                                        disabled={isFormSubmitted}
                                        isRequired
                                        min={0}
                                        step={0.1}
                                        max={100}
                                        required
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col xs={12} lg={2}>
                                  <CustomInput.Decimal
                                    name="other_charges"
                                    value={
                                      (values.other_charges =
                                        (values.subtotal *
                                          values.percent_other_charges) /
                                        100)
                                    }
                                    disabled
                                    isRequired
                                    prefix={prefix}
                                    required
                                  />
                                </Col>
                                <Col xs={12} lg={10}>
                                  <p className="mt-1 mb-0 small text-start text-lg-end">
                                    <b>TOTAL A PAGAR</b>
                                  </p>
                                </Col>
                                <Col xs={12} lg={2}>
                                  <CustomInput.Decimal
                                    name="total"
                                    value={
                                      (values.total =
                                        values.subtotal -
                                        values.discount +
                                        values.other_charges)
                                    }
                                    disabled
                                    isRequired
                                    prefix={prefix}
                                    required
                                  />
                                </Col>
                              </>
                            )}
                          </Row>
                        </>
                      );
                    }}
                  </FieldArray>
                </Col>
              </Row>

              <div className="text-lg-end">
                {!confirmation ? (
                  <Button
                    size="sm"
                    type="submit"
                    variant="primary"
                    disabled={isFormSubmitted}
                    className="mt-3 px-3"
                  >
                    <i className="bi bi-floppy me-2"></i>
                    Registrar la compra
                  </Button>
                ) : (
                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      size="sm"
                      type="button"
                      variant="secondary"
                      onClick={abortSubmit}
                      className="mt-3 px-3"
                    >
                      <i className="bi bi-x me-2"></i>
                      Volver al formulario
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      className="mt-3 px-3"
                      onClick={confirmSubmit}
                    >
                      <i className="bi bi-check2 me-2"></i>
                      He revisado y confirmo la compra
                    </Button>
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};
