import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, FieldArray } from "formik";
import { Button, Col, Row } from "react-bootstrap";
import * as Yup from "yup";

import apiSJM from "../../../api/apiSJM";
import { SimplePageHeader, CustomInput } from "../../components";
import { StockLot, ProductSelect2Option } from "./interfaces";
import { SweetAlert2 } from "../../utils";

const initialValues: StockLot = {
  type: "DECREMENT",
  description: "",
  stock_list: [{ id_product: "", quantity: 1 }],
};

export const LotCreate = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [products, setProducts] = useState<ProductSelect2Option[]>([]);

  const [confirmation, setConfirmation] = useState(false);
  const [formValues, setFormValues] = useState<StockLot | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get("/products/select2");
      setProducts(data.items);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/productos/ajustes");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = (values: StockLot) => {
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
        "¿Está seguro de registrar el ajuste de stock?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.post("/stock_lots/create", formValues);
      SweetAlert2.successToast(data.message || "¡Operación exitosa!");
      navigate(`/productos/ajustes/${data.id}`);
    } catch (error: any) {
      setIsFormSubmitted(false);
      setConfirmation(false);
      SweetAlert2.errorAlert(error.response.data.message || "¡Algo salió mal! Intente de nuevo.");
    }
  };

  return (
    <>
      <SimplePageHeader
        title="Registrar un nuevo ajuste de stock"
        goBackTo="/productos/ajustes"
        hr
      />

      {!loading && products.length > 0 && (
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validationSchema={Yup.object({
            type: Yup.string().required("El tipo de ajuste es requerido"),
            description: Yup.string().required("La descripción es requerida"),
            stock_list: Yup.array()
              .of(
                Yup.object().shape({
                  id_product: Yup.string().required("Este campo es requerido"),
                  quantity: Yup.number()
                    .required("Este campo es requerido")
                    .min(1, "Debe ser mayor a 0"),
                })
              )
              .min(1, "Debe agregar al menos un producto"),
          })}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form id="form" className="form">
              {/* DESCRIPCIÓN Y TIPO DE AJUSTE */}
              <Row>
                <Col lg={8}>
                  <CustomInput.Text
                    label="Descripción"
                    name="description"
                    placeholder="Ingrese una descripción del ajuste"
                    isInvalid={!!errors.description && touched.description}
                    disabled={isFormSubmitted}
                    isRequired
                  />
                </Col>

                <Col lg={4}>
                  <CustomInput.Select
                    label="Tipo de ajuste"
                    name="type"
                    isInvalid={!!errors.type && touched.type}
                    disabled={isFormSubmitted}
                    isRequired
                  >
                    <option value="DECREMENT">DECREMENTO</option>
                    <option value="INCREMENT">INCREMENTO</option>
                  </CustomInput.Select>
                </Col>
              </Row>

              <h6 className="mt-3">Detalle de productos a ajustar</h6>

              {/* LISTA DE PRODUCTOS */}
              <FieldArray name="stock_list">
                {({ push, remove }) => {
                  return (
                    <>
                      <Row>
                        <Col xs={3} lg={12}>
                          <Row>
                            <Col xs={12} lg={1}>
                              <label className="small mb-3 mb-lg-1">
                                Eliminar
                              </label>
                            </Col>
                            <Col xs={12} lg={8}>
                              <label className="small mb-3 mb-lg-1">
                                Producto <span className="text-danger">*</span>
                              </label>
                            </Col>
                            <Col xs={12} lg={3}>
                              <Row>
                                <Col xs={12} lg={5}>
                                  <p className="small mb-3 mb-lg-1 text-lg-center">
                                    Stock actual
                                  </p>
                                </Col>
                                <Col xs={12} lg={7}>
                                  <label className="small mb-3 mb-lg-1">
                                    {values.type === "DECREMENT"
                                      ? "Disminuir en"
                                      : "Aumentar en"}{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={9} lg={12}>
                          {values.stock_list.length > 0 ? (
                            <>
                              {values.stock_list.map((_, index) => (
                                <Row key={index} className="mb-3 mb-lg-1">
                                  <Col xs={12} lg={1}>
                                    <Button
                                      size="sm"
                                      className="px-2 mb-2 w-100"
                                      variant="danger"
                                      onClick={() => remove(index)}
                                      disabled={isFormSubmitted}
                                      style={{ height: "31px" }}
                                    >
                                      <i className="bi bi-x-circle-fill" />
                                    </Button>
                                  </Col>

                                  <Col xs={12} lg={8}>
                                    <CustomInput.Select2
                                      placeholder="Seleccione un producto para ajustar el stock"
                                      name={`stock_list[${index}].id_product`}
                                      options={products}
                                      onChange={(option: any) => {
                                        setFieldValue(
                                          `stock_list[${index}].id_product`,
                                          option.id
                                        );
                                      }}
                                      isOptionDisabled={(option: any) =>
                                        values.stock_list
                                          .map((item) => item.id_product)
                                          .includes(option.id)
                                      }
                                      isDisabled={isFormSubmitted}
                                      isInvalid={
                                        `stock_list[${index}].id_product` in
                                        errors
                                      }
                                    />
                                  </Col>

                                  <Col xs={12} lg={3}>
                                    <Row>
                                      <Col xs={12} lg={5}>
                                        <p className="mb-1 mb-lg-0 my-lg-1 text-lg-center small">
                                          {products.find(
                                            (product) =>
                                              product.id ===
                                              values.stock_list[index]
                                                .id_product
                                          )?.stock || 0}{" "}
                                        </p>
                                      </Col>
                                      <Col xs={12} lg={7}>
                                        <CustomInput.Number
                                          name={`stock_list[${index}].quantity`}
                                          disabled={isFormSubmitted}
                                          isRequired
                                          required
                                          className="text-center"
                                          min={1}
                                          max={
                                            values.type === "DECREMENT"
                                              ? products.find(
                                                  (product) =>
                                                    product.id ===
                                                    values.stock_list[index]
                                                      .id_product
                                                )?.stock || 0
                                              : undefined
                                          }
                                          isInvalid={
                                            `stock_list[${index}].quantity` in
                                            errors
                                          }
                                        />
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              ))}
                            </>
                          ) : (
                           <>
                            <p className="text-center text-muted small">
                              <i className="bi bi-info-circle"></i>&ensp;No hay
                              productos en la lista. Agregue un producto para
                              ajustar el stock.
                            </p>
                            <p className="text-danger text-center small fw-bold">
                              {(JSON.stringify(errors.stock_list))}
                            </p>
                           </>
                          )}
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={12} lg={2}>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() =>
                              push({ id_product: "", quantity: 1 })
                            }
                            disabled={
                              isFormSubmitted ||
                              values.stock_list.some(
                                (item) => item.id_product === ""
                              )
                            }
                            className="w-100 mb-2"
                          >
                            <i className="bi bi-plus-circle"></i>
                            &ensp; Agregar producto
                          </Button>
                        </Col>
                      </Row>
                    </>
                  );
                }}
              </FieldArray>
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
                    Registrar ajuste
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
                      He revisado y confirmo el ajuste
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
