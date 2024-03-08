import { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../../../api/apiSJM";
import {
  MySelect,
  MyTextArea,
  MyTextInput,
  MyNumberInput,
} from "../../../../components/forms";

interface ProductFormInterface {
  code?: string;
  name: string;
  description?: string;
  id_brand: string;
  id_category: string;
  id_unit: string;
  actual_stock?: number;
  inc_stock?: number;
  min_stock?: number;
  ideal_stock?: number;
  last_price?: number;
  id_currency: string;
}

const productForm: ProductFormInterface = {
  code: "",
  name: "",
  description: "",
  id_brand: "",
  id_category: "",
  id_unit: "",
  actual_stock: 0,
  inc_stock: 0,
  min_stock: 0,
  ideal_stock: 0,
  last_price: 0,
  id_currency: "",
};

interface ParamsInterface {
  id: number;
  name: string;
  symbol?: string;
  is_monetary?: boolean;
}

interface FormProps {
  onSubmit: (values: any) => void;
  initialForm?: ProductFormInterface;
  isFormSubmitted?: boolean;
  editMode?: boolean;
}

export const ProductForm = ({
  onSubmit,
  initialForm = productForm,
  isFormSubmitted,
  editMode = false,
}: FormProps) => {
  const [brands, setBrands] = useState<ParamsInterface[]>([]);
  const [categories, setCategories] = useState<ParamsInterface[]>([]);
  const [unitsOfMeasure, setUnitsOfMeasure] = useState<ParamsInterface[]>([]);
  const [currencies, setCurrencies] = useState<ParamsInterface[]>([]);

  const fetch = async () => {
    const [res1, res2, res3, res4] = await Promise.all([
      apiSJM.get("/brands"),
      apiSJM.get("/categories"),
      apiSJM.get("/units_of_measures"),
      apiSJM.get("/currencies"),
    ]);
    setBrands(res1.data.items);
    setCategories(res2.data.items);
    setUnitsOfMeasure(res3.data.items);
    setCurrencies(res4.data.items);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <Formik
        initialValues={initialForm}
        onSubmit={(values) => {
          onSubmit(values);
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("El nombre es requerido"),
          id_brand: Yup.string().required("La marca es requerida"),
          id_category: Yup.string().required("La categoría es requerida"),
          id_unit: Yup.string().required("La unidad de compra es requerida"),
          id_currency: Yup.string().required("La moneda es requerida"),
        })}
      >
        {({ errors, touched }) => (
          <Form id="form">
            <Row>
              <Col lg={6}>
                <h2 className="fs-6">Información del producto</h2>
                <Row>
                  <Col xs={6}>
                    <MySelect
                      label="Categoría *"
                      name="id_category"
                      as="select"
                      isInvalid={!!errors.id_category && touched.id_category}
                    >
                      <option value="">Seleccione una opción</option>
                      {categories &&
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </MySelect>
                  </Col>
                  <Col xs={6}>
                    <MySelect
                      label="Marca *"
                      name="id_brand"
                      as="select"
                      isInvalid={!!errors.id_brand && touched.id_brand}
                    >
                      <option value="">Seleccione una opción</option>
                      {brands &&
                        brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                    </MySelect>
                  </Col>
                </Row>

                <MyTextInput
                  label="Código"
                  name="code"
                  placeholder="Ingrese código"
                  isInvalid={!!errors.code && touched.code}
                />
                <MyTextInput
                  label="Nombre *"
                  name="name"
                  placeholder="Ingrese nombre"
                  isInvalid={!!errors.name && touched.name}
                />
                <MyTextArea
                  label="Descripción"
                  name="description"
                  placeholder="Ingrese una descripción adicional (opcional)"
                  rows={4}
                  isInvalid={!!errors.description && touched.description}
                />
              </Col>
              <Col lg={6}>
                <h2 className="fs-6 mt-5 mt-lg-0">Información de compra</h2>
                <Row>
                  <Col lg={6}>
                    <MySelect
                      label="Unidad de compra *"
                      name="id_unit"
                      as="select"
                      isInvalid={!!errors.id_unit && touched.id_unit}
                    >
                      <option value="">Seleccione una opción</option>
                      {unitsOfMeasure &&
                        unitsOfMeasure.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name}
                          </option>
                        ))}
                    </MySelect>
                  </Col>
                  <Col lg={6}>
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
                  </Col>
                </Row>
                <MyNumberInput
                  label="Costo / unidad de compra"
                  name="last_price"
                  placeholder="Ingrese costo actual"
                  isInvalid={!!errors.last_price && touched.last_price}
                />
                <h2 className="fs-6 mt-5">Información de stock</h2>
                <Row>
                  <Col lg={4}>
                    <MyNumberInput
                      label="Stock actual"
                      name="actual_stock"
                      placeholder="Ingrese stock actual"
                      isInvalid={!!errors.actual_stock && touched.actual_stock}
                      disabled={editMode}
                    />
                    <p className="text-muted text-justify small lh-1">
                      <small>
                        <i className="bi bi-info-circle me-1"></i> El{" "}
                        <b>stock actual</b> representa la cantidad existente del
                        producto en la empresa en el momento de la consulta y
                        expresado en la unidad de compra seleccionada
                      </small>
                    </p>
                  </Col>

                  <Col lg={4}>
                    <MyNumberInput
                      label="Stock mínimo"
                      name="min_stock"
                      placeholder="Ingrese stock mínimo"
                      isInvalid={!!errors.min_stock && touched.min_stock}
                    />
                    <p className="text-muted text-justify small lh-1">
                      <small>
                        <i className="bi bi-info-circle me-1"></i> El{" "}
                        <b>stock mínimo</b> representa la cantidad a partir de
                        la cual se debería reabastecer el producto. Mostrará
                        alertas en caso de que el stock actual sea menor al
                        stock mínimo
                      </small>
                    </p>
                  </Col>

                  <Col lg={4}>
                    <MyNumberInput
                      label="Stock ideal"
                      name="ideal_stock"
                      placeholder="Ingrese stock ideal"
                      isInvalid={!!errors.ideal_stock && touched.ideal_stock}
                    />
                    <p className="text-muted text-justify small lh-1">
                      <small>
                        <i className="bi bi-info-circle me-1"></i> El{" "}
                        <b>stock ideal</b> es el nivel de stock que se desea
                        mantener del producto. Se utiliza para calcular la
                        cantidad a reabastecer tomando como base el stock actual
                        y el stock ideal
                      </small>
                    </p>
                  </Col>
                </Row>
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
