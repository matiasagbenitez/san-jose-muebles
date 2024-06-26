import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";

import {
  EstimateFormInterface,
  EstimateItemInterface,
  CurrencyInterface,
  ProjectBasicData,
} from "../interfaces";
import { Button, Col, Row } from "react-bootstrap";

import { CustomInput } from "../../../components";
import { useEffect, useState } from "react";

const newItem: EstimateItemInterface = {
  quantity: 1,
  description: "",
  price: 0,
  subtotal: 0,
};

interface Props {
  project: ProjectBasicData;
  currencies: CurrencyInterface;
  isFormSubmitting: boolean;
  onSubmit: (formData: EstimateFormInterface) => void;
}

export const EstimateForm = ({
  project,
  currencies,
  isFormSubmitting,
  onSubmit,
}: Props) => {

  const initialForm: EstimateFormInterface = {
    gen_date: new Date().toISOString().split("T")[0],
    valid_period: "",
    client_name: project.client,
    title: `PRESUPUESTO ${project.title}`,
    id_currency: "",
    subtotal: 0,
    discount: 0,
    fees: 0,
    total: 0,
    guarantee:
      "GARANTÍA POR 5 AÑOS Y MANTENIMIENTO SIN COSTO POR TIEMPO ILIMITADO",
    observations: "",
    items: [
      {
        quantity: 1,
        description: "PROYECTO COMPLETO SEGÚN DESCRIPCIÓN",
        price: 0,
        subtotal: 0,
      },
    ],

    percent_discount: 0,
    percent_fees: 0,
  };

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyInterface>();
  const [prefix, setPrefix] = useState<string>("");

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
  return (
    <Formik
      initialValues={initialForm}
      onSubmit={(values) => {
        onSubmit(values);
      }}
      validationSchema={Yup.object({
        gen_date: Yup.date().required("La fecha de emisión es requerida"),
        valid_period: Yup.string(),
        client_name: Yup.string().required(
          "El nombre del cliente es requerido"
        ),
        title: Yup.string().required("El título del presupuesto es requerido"),
        id_currency: Yup.string().required(
          "La moneda del presupuesto es requerida"
        ),
        subtotal: Yup.number().required("Revisar"),
        discount: Yup.number().min(0, "Revisar").required("Revisar"),
        fees: Yup.number().min(0, "Revisar").required("Revisar"),
      })}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form id="form">
          <Row>
            <Col xs={12} md={4} xl={3}>
              <CustomInput.Date
                label="Fecha de emisión"
                name="gen_date"
                isRequired
                disabled={isFormSubmitting}
                isInvalid={!!errors.gen_date && touched.gen_date}
              />
            </Col>
            <Col xs={12} md={4} xl={3}>
              <CustomInput.Select
                label="Período de validez"
                name="valid_period"
                disabled={isFormSubmitting}
                isInvalid={!!errors.valid_period && touched.valid_period}
                isRequired
              >
                <option value="0">Sin periodo de validez (ilimitado)</option>
                <option value="15">15 días</option>
                <option value="30">30 días</option>
                <option value="60">60 días</option>
                <option value="90">90 días</option>
                <option value="120">120 días</option>
                <option value="180">180 días</option>
              </CustomInput.Select>
            </Col>
            <Col xs={12} md={4} xl={6}>
              <CustomInput.Select
                label="Moneda del presupuesto"
                name="id_currency"
                isRequired
                disabled={isFormSubmitting}
                isInvalid={!!errors.id_currency && touched.id_currency}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const currency = Object.values(currencies).find(
                    (currency) => currency.id == e.target.value
                  );
                  setSelectedCurrency(currency);
                  setFieldValue("id_currency", e.target.value);
                }}
              >
                <option value="">Seleccione una moneda</option>
                {Object.values(currencies).map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.name} ({currency.symbol})
                  </option>
                ))}
              </CustomInput.Select>
            </Col>
          </Row>
          <Row>
            <Col xs={12} xl={6}>
              <CustomInput.Text
                label="Nombre del cliente"
                name="client_name"
                isRequired
                disabled={isFormSubmitting}
                isInvalid={!!errors.client_name && touched.client_name}
              />
            </Col>
            <Col xs={12} xl={6}>
              <CustomInput.Text
                label="Título"
                name="title"
                isRequired
                disabled={isFormSubmitting}
                isInvalid={!!errors.title && touched.title}
              />
            </Col>
            <Col xs={12}>
              <CustomInput.TextArea
                label="Descripción"
                name="description"
                disabled={isFormSubmitting}
                isRequired
                rows={3}
              />
            </Col>
            <Col xs={12} md={6}>
              <h5 className="my-3">Detalle del presupuesto</h5>
            </Col>
            {values.items.length === 0 && (
              <Col
                xs={12}
                md={6}
                className="d-flex align-items-center gap-3 justify-content-start justify-content-md-end"
              >
                <b>TOTAL PRESUPUESTO</b>
                <CustomInput.Decimal
                  name="total"
                  value={values.total}
                  onValueChange={(valuesLocal: any) => {
                    setFieldValue("total", valuesLocal.floatValue || 0);
                  }}
                  style={{ fontWeight: "bold" }}
                  prefix={prefix}
                  required
                />
              </Col>
            )}
          </Row>

          <FieldArray name="items">
            {({ push, remove }) => {
              const handleRemove = (index: number) => {
                if (values.items.length === 1) {
                  setFieldValue("subtotal", 0);
                  setFieldValue("percent_discount", 0);
                  setFieldValue("discount", 0);
                  setFieldValue("percent_fees", 0);
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
                  setFieldValue(`items.${index}.quantity`, quantity);
                  const price = values.items[index].price;
                  const subtotal = price * quantity;
                  setFieldValue(`items.${index}.subtotal`, subtotal);
                } else {
                  setFieldValue(`items.${index}.quantity`, "");
                  setFieldValue(`items.${index}.subtotal`, "");
                }
              };

              const handlePriceChange = (index: number, price: number) => {
                setFieldValue(`items.${index}.price`, price);
                const quantity = values.items[index].quantity;
                const subtotal = price * quantity;
                setFieldValue(`items.${index}.subtotal`, subtotal);
              };
              return (
                <>
                  {values.items.map((_, index) => (
                    <Row key={index}>
                      <Col xs={12} md={2}>
                        <Row>
                          <Col xs={6}>
                            {index === 0 && (
                              <label className="small mb-1 text-white">
                                Eliminar
                              </label>
                            )}
                            <Button
                              size="sm"
                              className="px-2 mb-2 w-100"
                              variant="danger"
                              onClick={() => handleRemove(index)}
                              disabled={isFormSubmitting}
                              style={{ height: "31px" }}
                            >
                              <i className="bi bi-x-circle-fill" />
                            </Button>
                          </Col>
                          <Col xs={6}>
                            <CustomInput.Number
                              label={index === 0 ? "Cant" : ""}
                              className="text-center"
                              name={`items.${index}.quantity`}
                              value={values.items[index].quantity}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                const quantity = parseFloat(e.target.value);
                                handleQuantityChange(index, quantity);
                              }}
                              disabled={isFormSubmitting}
                              isRequired
                              required
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12} md={6}>
                        <CustomInput.TextArea
                          label={index === 0 ? "Descripción" : ""}
                          name={`items[${index}].description`}
                          disabled={isFormSubmitting}
                          isRequired
                          rows={1}
                          required
                        />
                      </Col>

                      <Col xs={6} md={2}>
                        <CustomInput.Decimal
                          label={index === 0 ? "Precio" : ""}
                          name={`items.${index}.price`}
                          value={values.items[index].price}
                          onValueChange={(valuesLocal: any) => {
                            const price = valuesLocal.floatValue || 0;
                            handlePriceChange(index, price);
                          }}
                          disabled={isFormSubmitting}
                          isRequired
                          prefix={prefix}
                          required
                          min={1}
                        />
                      </Col>

                      <Col xs={6} md={2}>
                        <CustomInput.Decimal
                          label={index === 0 ? "Subtotal" : ""}
                          name={`items.${index}.subtotal`}
                          value={values.items[index].subtotal}
                          isRequired
                          disabled
                          prefix={prefix}
                          required
                        />
                      </Col>
                    </Row>
                  ))}

                  <Row>
                    <Col xs={12} md={2}>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => push(newItem)}
                        disabled={isFormSubmitting}
                        className="w-100 mb-2"
                      >
                        <i className="bi bi-plus-circle"></i>
                        &ensp; Agregar item
                      </Button>
                    </Col>
                    {values.items.length > 0 && (
                      <>
                        <Col xs={12} md={8}>
                          <p className="mt-1 mb-0 small text-start text-md-end">
                            <b>Subtotal</b>
                          </p>
                        </Col>
                        <Col xs={12} md={2}>
                          <CustomInput.Decimal
                            name="subtotal"
                            value={
                              (values.subtotal = values.items.reduce(
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
                        <Col xs={12} md={6} lg={7}></Col>
                        <Col xs={12} md={4} lg={3}>
                          <Row>
                            <Col xs={6}>
                              <p className="mt-1 mb-0 small text-start text-md-end">
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
                                    !isNaN(parseFloat(e.target.value)) &&
                                    parseFloat(e.target.value) >= 0 &&
                                    parseFloat(e.target.value) <= 100
                                  ) {
                                    const percent = Math.abs(
                                      parseFloat(e.target.value)
                                    );
                                    setFieldValue("percent_discount", percent);
                                  } else {
                                    setFieldValue("percent_discount", 0);
                                  }
                                }}
                                disabled={isFormSubmitting}
                                isRequired
                                min={0}
                                step={0.1}
                                max={100}
                                required
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} md={2}>
                          <CustomInput.Decimal
                            name="discount"
                            value={
                              (values.discount =
                                (values.subtotal * values.percent_discount) /
                                100)
                            }
                            disabled
                            isRequired
                            prefix={`${prefix} - `}
                            required
                          />
                        </Col>

                        <Col xs={12} md={6} lg={7}></Col>
                        <Col xs={12} md={4} lg={3}>
                          <Row>
                            <Col xs={6}>
                              <p className="mt-1 mb-0 small text-start text-md-end">
                                <b>Impuestos (%)</b>
                              </p>
                            </Col>
                            <Col xs={6}>
                              <CustomInput.Number
                                className="text-center"
                                name="percent_fees"
                                value={values.percent_fees}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (
                                    !isNaN(parseFloat(e.target.value)) &&
                                    parseFloat(e.target.value) >= 0 &&
                                    parseFloat(e.target.value) <= 100
                                  ) {
                                    const percent = Math.abs(
                                      parseFloat(e.target.value)
                                    );
                                    setFieldValue("percent_fees", percent);
                                  } else {
                                    setFieldValue("percent_fees", 0);
                                  }
                                }}
                                disabled={isFormSubmitting}
                                isRequired
                                min={0}
                                step={0.1}
                                max={100}
                                required
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} md={2}>
                          <CustomInput.Decimal
                            name="fees"
                            value={
                              (values.fees =
                                (values.subtotal * values.percent_fees) / 100)
                            }
                            disabled
                            isRequired
                            prefix={prefix}
                            required
                          />
                        </Col>
                        <Col xs={12} md={10}>
                          <p className="mt-1 mb-0 small text-start text-md-end">
                            <b>TOTAL PRESUPUESTO</b>
                          </p>
                        </Col>
                        <Col xs={12} md={2}>
                          <CustomInput.Decimal
                            name="total"
                            value={
                              (values.total =
                                values.subtotal - values.discount + values.fees)
                            }
                            disabled
                            isRequired
                            style={{ fontWeight: "bold" }}
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

          <Row>
            <Col xs={12} xl={6}>
              <CustomInput.Text
                label="Garantía"
                name="guarantee"
                isRequired
                disabled={isFormSubmitting}
                isInvalid={!!errors.guarantee && touched.guarantee}
              />
            </Col>
            <Col xs={12} xl={6}>
              <CustomInput.Text
                label="Observaciones"
                name="annotations"
                disabled={isFormSubmitting}
              />
            </Col>
            <Col xs={8}></Col>
            <Col xs={12} md={2}>
              {" "}
              <Button
                size="sm"
                className="mt-3 w-100"
                disabled={isFormSubmitting}
                variant="secondary"
                onClick={() => {
                  setFieldValue("items", [newItem]);
                  setFieldValue("subtotal", 0);
                  setFieldValue("discount", 0);
                  setFieldValue("fees", 0);
                  setFieldValue("total", 0);
                  setFieldValue(
                    "guarantee",
                    "GARANTÍA POR 5 AÑOS Y MANTENIMIENTO SIN COSTO POR TIEMPO ILIMITADO"
                  );
                  setFieldValue("annotations", "");
                  setFieldValue(
                    "gen_date",
                    new Date().toISOString().split("T")[0]
                  );
                  setFieldValue("valid_period", "");
                  setFieldValue("client_name", project.client);
                  setFieldValue("title", `PRESUPUESTO ${project.title}`);
                  setFieldValue("id_currency", "");
                }}
              >
                <i className="bi bi-arrow-counterclockwise me-2"></i>
                Reiniciar formulario
              </Button>
            </Col>
            <Col xs={12} md={2}>
              {" "}
              <Button
                size="sm"
                className="mt-3 w-100"
                type="submit"
                disabled={isFormSubmitting}
                variant="primary"
              >
                <i className="bi bi-floppy me-2"></i>
                Guardar presupuesto
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};
