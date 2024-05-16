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
    val_date: "",
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
        val_date: Yup.date(),
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
        total: Yup.number().required("Revisar"),

        items: Yup.array()
          .of(
            Yup.object().shape({
              quantity: Yup.number().required("La cantidad es requerida"),
              description: Yup.string().required(
                "La descripción del item es requerida"
              ),
              price: Yup.number().required("El precio es requerido"),
              subtotal: Yup.number().required("El subtotal es requerido"),
            })
          )
          .min(1, "Debe agregar al menos un item"),
      })}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form id="form">
          <Row>
            <Col xs={12} md={6} xl={3}>
              <CustomInput.Date
                label="Fecha de emisión"
                name="gen_date"
                isRequired
                disabled={isFormSubmitting}
                isInvalid={!!errors.gen_date && touched.gen_date}
              />
            </Col>
            <Col xs={12} md={6} xl={3}>
              <CustomInput.Date
                label="Fecha de validez"
                name="val_date"
                disabled={isFormSubmitting}
                isInvalid={!!errors.val_date && touched.val_date}
              />
            </Col>
            <Col xs={12} md={6}>
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
          </Row>

          <h6 className="my-3">Detalle del presupuesto</h6>

          <FieldArray name="items">
            {({ push, remove }) => {
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
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            className="px-2 mb-2"
                            variant="danger"
                            onClick={() => remove(index)}
                            disabled={isFormSubmitting}
                            style={{ height: "31px", alignSelf: "flex-end" }}
                          >
                            <i className="bi bi-x-circle-fill" />
                          </Button>
                          <CustomInput.Number
                            label={index === 0 ? "Cantidad" : ""}
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
                          />
                        </div>
                      </Col>
                      <Col xs={12} md={6}>
                        <CustomInput.TextArea
                          label={index === 0 ? "Descripción" : ""}
                          name={`items[${index}].description`}
                          disabled={isFormSubmitting}
                          isRequired
                          rows={1}
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
                        className="w-100"
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
                          />
                        </Col>
                        <Col xs={12} md={6} lg={7} xl={8}></Col>
                        <Col xs={12} md={4} lg={3} xl={2}>
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
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (!isNaN(parseFloat(e.target.value))) {
                                    const percent = parseFloat(e.target.value);
                                    const discount = Math.abs(
                                      (values.subtotal * percent) / 100
                                    );
                                    setFieldValue("discount", discount * -1);
                                  } else {
                                    setFieldValue("discount", 0);
                                  }
                                }}
                                disabled={isFormSubmitting}
                                isRequired
                                min={0}
                                max={100}
                                prefix={prefix}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} md={2}>
                          <CustomInput.Decimal
                            name="discount"
                            value={values.discount}
                            disabled
                            isRequired
                            prefix={prefix}
                          />
                        </Col>
                        <Col xs={12} md={6} lg={7} xl={8}></Col>
                        <Col xs={12} md={4} lg={3} xl={2}>
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
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (!isNaN(parseFloat(e.target.value))) {
                                    const percent = parseFloat(e.target.value);
                                    const fees = Math.abs(
                                      (values.subtotal * percent) / 100
                                    );
                                    setFieldValue("fees", fees);
                                  } else {
                                    setFieldValue("fees", 0);
                                  }
                                }}
                                disabled={isFormSubmitting}
                                isRequired
                                min={0}
                                max={100}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} md={2}>
                          <CustomInput.Decimal
                            name="fees"
                            value={values.fees}
                            disabled
                            isRequired
                            prefix={prefix}
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
                                values.subtotal + values.discount + values.fees)
                            }
                            disabled
                            isRequired
                            style={{ fontWeight: "bold" }}
                            prefix={prefix}
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
                  setFieldValue("guarantee", "GARANTÍA POR 5 AÑOS Y MANTENIMIENTO SIN COSTO POR TIEMPO ILIMITADO");
                  setFieldValue("annotations", "");
                  setFieldValue("gen_date", new Date().toISOString().split("T")[0]);
                  setFieldValue("val_date", "");
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
