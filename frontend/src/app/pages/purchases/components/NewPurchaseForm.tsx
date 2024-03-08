import { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../../api/apiSJM";
import {
  MySelect,
  MyTextArea,
  MyTextInput,
  MyNumberInput,
  MyInputDate,
} from "../../../components/forms";

interface CurrencyInterface {
    id: string;
    name: string;
}

interface SupplierInterface {
    id: string;
    name: string;
    locality: string;
}

interface ProductFormInterface {
    id_supplier: string;
    id_currency: string;
    date: string;
}

const initialForm: ProductFormInterface = {
    id_supplier: "",
    id_currency: "",
    date: "",
};

interface FormProps {
  onSubmit: (values: any) => void;
  initialForm?: ProductFormInterface;
  isFormSubmitted?: boolean;
  editMode?: boolean;
}

export const NewPurchaseForm = ({
  onSubmit,
  isFormSubmitted,
}: FormProps) => {
  const [currencies, setCurrencies] = useState<CurrencyInterface[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierInterface[]>([]);

  const fetch = async () => {
    const [res1, res2] = await Promise.all([
      apiSJM.get("/currencies"),
      apiSJM.get("/suppliers/select"),
    ]);
    setCurrencies(res1.data.items);
    setSuppliers(res2.data.items);
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
          date: Yup.date().required("La fecha es requerida"),
          id_supplier: Yup.string().required("El proveedor es requerido"),
          id_currency: Yup.string().required("La moneda es requerida"),
        })}
      >
        {({ errors, touched }) => (
          <Form id="form">
            <Row>
              <Col lg={4}>
                <h2 className="fs-6">Información general</h2>
                <Row>
                  <Col xs={6}>
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
                  </Col>
                  <Col xs={6}>
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

                <MyInputDate label="Fecha *" name="date" />

              
              </Col>
              <Col lg={6}>
                <h2 className="fs-6 mt-5 mt-lg-0">Detalle de la compra</h2>
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
