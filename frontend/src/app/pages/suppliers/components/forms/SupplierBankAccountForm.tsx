import { useState, useEffect } from "react";
import { Button, ButtonGroup, Col, Modal, Row } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../../../api/apiSJM";
import { CustomInput } from "../../../../components";
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
      <Modal.Header closeButton>
        <Modal.Title>
          {editingId ? "Editar" : "Agregar"} cuenta bancaria
        </Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={form}
        onSubmit={(values) => {
          onSubmit(values);
        }}
        validationSchema={Yup.object({
          id_bank: Yup.string().required("El banco es requerido"),
          cbu_cvu: Yup.string().length(22, "El CBU/CVU debe tener 22 dígitos"),
          alias: Yup.string().matches(
            /^[a-zA-Z0-9\.-]{6,20}$/,
            "El alias debe tener entre 6 y 20 caracteres (letras, números, puntos y guiones)" // prettier-ignore
          ),
        })}
      >
        {({ errors, touched }) => (
          <Form id="form">
            <Modal.Body>
              <Row>
                <Col lg={6}>
                  <CustomInput.Select
                    label="Banco"
                    name="id_bank"
                    as="select"
                    placeholder="Seleccione un banco"
                    isInvalid={!!errors.id_bank && touched.id_bank}
                    isDisabled={isFormSubmitted}
                    isRequired
                  >
                    <option value="">Seleccione un banco</option>
                    {banks &&
                      banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name}
                        </option>
                      ))}
                  </CustomInput.Select>
                </Col>

                <Col lg={6}>
                  <CustomInput.Text
                    label="Titular de la cuenta"
                    name="account_owner"
                    placeholder="Ingrese el titular de la cuenta"
                    isInvalid={!!errors.account_owner && touched.account_owner}
                  />
                </Col>

                <Col lg={6}>
                  <CustomInput.Text
                    label="CBU/CVU"
                    name="cbu_cvu"
                    placeholder="Ingrese el CBU/CVU"
                    isInvalid={!!errors.cbu_cvu && touched.cbu_cvu}
                  />
                </Col>

                <Col lg={6}>
                  <CustomInput.Text
                    label="Alias"
                    name="alias"
                    placeholder="Ingrese un alias"
                    isInvalid={!!errors.alias && touched.alias}
                  />
                </Col>

                <Col lg={6}>
                  <CustomInput.Text
                    label="Número de cuenta"
                    name="account_number"
                    placeholder="Ingrese el número de cuenta"
                    isInvalid={
                      !!errors.account_number && touched.account_number
                    }
                  />
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer>
              <ButtonGroup size="sm">
                <Button
                  variant="secondary"
                  disabled={isFormSubmitted}
                  onClick={onHide}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isFormSubmitted}
                >
                  <i className="bi bi-floppy mx-1"></i>{" "}
                  {editingId ? "Actualizar información" : "Registrar cuenta"}
                </Button>
              </ButtonGroup>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
