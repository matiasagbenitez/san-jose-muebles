import { useState, useEffect } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../../../api/apiSJM";
import { MySelect, MyTextInput } from "../../../../components/forms";
import { BankAccountFormInterface } from "../../SupplierBankAccounts";

interface BanksInterface {
  id: number;
  name: string;
}

interface FormProps {
  show: boolean;
  onHide: () => void;
  editingId: number | null;
  form: BankAccountFormInterface;
  onSubmit: (values: any) => void;
  isFormSubmitted?: boolean;
}

export const SupplierBankAccountForm = ({
  show,
  onHide,
  editingId,
  form,
  onSubmit,
  isFormSubmitted,
}: FormProps) => {
  const [banks, setBanks] = useState<BanksInterface[]>([]);

  const fetch = async () => {
    const { data } = await apiSJM.get("/banks");
    setBanks(data.items);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <div className="p-4">
        <h1 className="fs-5">
          {editingId ? "Modificar cuenta bancaria" : "Crear cuenta bancaria"}
        </h1>
        <hr className="my-2" />

        <Formik
          initialValues={form}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={Yup.object({
            id_bank: Yup.string().required("El banco es requerido"),
            cbu_cvu: Yup.string().length(
              22,
              "El CBU/CVU debe tener 22 dígitos"
            ),
            alias: Yup.string().matches(
              /^[a-zA-Z0-9\.-]{6,20}$/,
              "El alias debe tener entre 6 y 20 caracteres (letras, números, puntos y guiones)" // prettier-ignore
            ),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <Row>
                <Col md={6}>
                  <MySelect
                    label="Banco"
                    name="id_bank"
                    as="select"
                    placeholder="Seleccione un banco"
                    isInvalid={!!errors.id_bank && touched.id_bank}
                  >
                    <option value="">Seleccione un banco</option>
                    {banks &&
                      banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name}
                        </option>
                      ))}
                  </MySelect>
                </Col>

                <Col md={6}>
                  <MyTextInput
                    label="Titular de la cuenta"
                    name="account_owner"
                    type="text"
                    placeholder="Ingrese el titular de la cuenta"
                    isInvalid={!!errors.account_owner && touched.account_owner}
                  />
                </Col>

                <Col md={6}>
                  <MyTextInput
                    label="CBU/CVU"
                    name="cbu_cvu"
                    type="text"
                    placeholder="Ingrese el CBU/CVU"
                    isInvalid={!!errors.cbu_cvu && touched.cbu_cvu}
                  />
                </Col>

                <Col md={6}>
                  <MyTextInput
                    label="Alias"
                    name="alias"
                    type="text"
                    placeholder="Ingrese un alias"
                    isInvalid={!!errors.alias && touched.alias}
                  />
                </Col>

                <Col md={6}>
                  <MyTextInput
                    label="Número de cuenta"
                    name="account_number"
                    type="text"
                    placeholder="Ingrese el número de cuenta"
                    isInvalid={
                      !!errors.account_number && touched.account_number
                    }
                  />
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
      </div>
    </Modal>
  );
};
