import { useState, useEffect } from "react";
import { Button, Col, Row, Image } from "react-bootstrap";
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
  // inc_stock?: number;
  min_stock?: number;
  rep_stock?: number;
  last_price?: number;
  id_currency: string;
}

const supplierForm: ProductFormInterface = {
  code: "",
  name: "",
  description: "",
  id_brand: "",
  id_category: "",
  id_unit: "",
  actual_stock: 0,
  // inc_stock: 0,
  min_stock: 0,
  rep_stock: 0,
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
}

export const ProductForm = ({
  onSubmit,
  initialForm = supplierForm,
  isFormSubmitted,
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
              <Col md={2}>
                <Image src="https://placehold.co/250" thumbnail width="100%" />
              </Col>
              <Col md={10}>
                <Row>
                  <Col md={6}>
                    <MySelect
                      label="Marca *"
                      name="id_brand"
                      as="select"
                      placeholder="Seleccione una marca"
                      isInvalid={!!errors.id_brand && touched.id_brand}
                    >
                      <option value="">Seleccione una marca</option>
                      {brands &&
                        brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                    </MySelect>
                  </Col>
                  <Col md={6}>
                    <MySelect
                      label="Categoría *"
                      name="id_category"
                      as="select"
                      placeholder="Seleccione una categoría"
                      isInvalid={!!errors.id_category && touched.id_category}
                    >
                      <option value="">Seleccione una categoría</option>
                      {categories &&
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </MySelect>
                  </Col>
                  <Col md={3}>
                    <MyTextInput
                      label="Código"
                      name="code"
                      placeholder="Ingrese código"
                      isInvalid={!!errors.code && touched.code}
                    />
                  </Col>
                  <Col md={9}>
                    <MyTextInput
                      label="Nombre *"
                      name="name"
                      placeholder="Ingrese nombre"
                      isInvalid={!!errors.name && touched.name}
                    />
                  </Col>
                  <Col xs={12}>
                    <MyTextArea
                      label="Descripción"
                      name="description"
                      placeholder="Ingrese una descripción adicional (opcional)"
                      rows={4}
                      isInvalid={!!errors.description && touched.description}
                    />
                  </Col>
                  <Col md={6}>
                    <MySelect
                      label="Unidad de compra *"
                      name="id_unit"
                      as="select"
                      placeholder="Seleccione una unidad de compra"
                      isInvalid={!!errors.id_unit && touched.id_unit}
                    >
                      <option value="">Seleccione una unidad de compra</option>
                      {unitsOfMeasure &&
                        unitsOfMeasure.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name}
                          </option>
                        ))}
                    </MySelect>
                  </Col>
                  <Col md={2}>
                    <MyNumberInput
                      label="Stock actual"
                      name="actual_stock"
                      placeholder="Ingrese stock actual"
                      isInvalid={!!errors.actual_stock && touched.actual_stock}
                    />
                  </Col>
                  <Col md={2}>
                    <MyNumberInput
                      label="Stock mínimo"
                      name="min_stock"
                      placeholder="Ingrese stock mínimo"
                      isInvalid={!!errors.min_stock && touched.min_stock}
                    />
                  </Col>
                  <Col md={2}>
                    <MyNumberInput
                      label="Stock ideal"
                      name="rep_stock"
                      placeholder="Ingrese stock ideal"
                      isInvalid={!!errors.rep_stock && touched.rep_stock}
                    />
                  </Col>
                  <Col md={6}>
                    <MySelect
                      label="Moneda de compra *"
                      name="id_currency"
                      as="select"
                      isInvalid={!!errors.id_currency && touched.id_currency}
                    >
                      <option value="">Seleccione una moneda de compra</option>
                      {currencies &&
                        currencies.map((currency) => (
                          <option key={currency.id} value={currency.id}>
                            {currency.name}
                          </option>
                        ))}
                    </MySelect>
                  </Col>
                  <Col md={2}>
                    <MyNumberInput
                      label="Costo / un. compra"
                      name="last_price"
                      placeholder="Ingrese costo actual"
                      isInvalid={!!errors.last_price && touched.last_price}
                    />
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
