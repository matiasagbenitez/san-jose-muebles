import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, InputGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { DayJsAdapter, toMoney } from "../../../helpers";

import { NumericFormat } from "react-number-format";
import { SweetAlert2 } from "../../utils";

interface AccountInterface {
  id: number;
  id_supplier: number;
  supplier: {
    name: string;
  };
  balance: number;
  id_currency: number;
  currency: {
    name: string;
    symbol: string;
    is_monetary: boolean;
  };
}

interface TransactionInterface {
  id: number;
  createdAt: Date;
  user: { name: string };
  description: string;
  purchase_transaction: { id_purchase: number };
  type:
    | "NEW_PURCHASE"
    | "DEL_PURCHASE"
    | "NEW_PAYMENT"
    | "POS_ADJ"
    | "NEG_ADJ"
    | "NEW_CLIENT_PAYMENT"
    | "DEL_CLIENT_PAYMENT";
  prev_balance: number;
  amount: number;
  post_balance: number;
}

const initialForm = {
  type: "",
  description: "",
  amount: 0,
};

export const SupplierAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [transactions, setTransactions] = useState<
    TransactionInterface[] | null
  >();

  const [formData, setFormData] = useState(initialForm);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(
        `/supplier_accounts/${id}/transactions`
      );
      setAccount(data.account);
      setTransactions(data.transactions);
      setLoading(false);
    } catch (error) {
      console.error(error);
      navigate(`/proveedores/${id}`);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setFormData(initialForm);
  };

  const handleRedirectPurchase = (id_purchase: number) => {
    navigate(`/compras/${id_purchase}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const confirmation = await SweetAlert2.confirm(
        "¿Está seguro de registrar el movimiento?"
      );
      if (!confirmation.isConfirmed) return;
      setLoading(true);
      const { data } = await apiSJM.post(
        "/supplier_account_transactions/new-movement",
        { ...formData, id_supplier_account: id }
      );
      console.log(data);
      fetch();
      setIsModalOpen(false);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && transactions && account && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-3 align-items-center">
              <Button
                variant="light border text-muted"
                size="sm"
                onClick={() => navigate(`/proveedores/${id}`)}
                title="Volver al detalle del proveedor"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Atrás
              </Button>
              <h1 className="fs-5 my-0">
                Cuenta corriente {account.supplier.name}
              </h1>
            </div>
            <Button size="sm" variant="success" onClick={handleCreate}>
              Nuevo movimiento
            </Button>
          </div>

          <hr />

          <span>
            <b>Moneda:</b> {account.currency.name} ({account.currency.symbol})
          </span>

          {account.balance < 0 && (
            <span className="text-danger ms-4">
              <b>Deuda con el proveedor:</b>{" "}
              {account.currency.is_monetary && "$"}
              {toMoney(account.balance * -1)}
            </span>
          )}

          {account.balance == 0 && (
            <span className="text-muted ms-4">
              <b>La cuenta está al día (no registra deudas ni saldo a favor)</b>
            </span>
          )}

          {account.balance > 0 && (
            <span className="text-success ms-4">
              <b>Saldo a favor con el proveedor:</b>{" "}
              {account.currency.is_monetary && "$ "}
              {toMoney(account.balance)}
            </span>
          )}

          <Table
            striped
            bordered
            hover
            responsive
            size="sm"
            className="small mt-3"
          >
            <thead>
              <tr className="text-center text-uppercase align-middle">
                <th className="px-3">ID</th>
                <th className="col-1">Registrado el</th>
                <th className="col-1">Registrado por</th>
                <th className="col-7">Descripción del movimiento</th>
                <th className="col-1">Saldo anterior</th>
                <th className="col-1">Monto</th>
                <th className="col-1">Saldo posterior</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                <>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="text-center">{transaction.id}</td>
                      <td className="text-center">
                        {DayJsAdapter.toDayMonthYearHour(transaction.createdAt)}
                      </td>

                      <td className="text-center">{transaction.user.name}</td>

                      <td>
                        {transaction.description}
                        {transaction.purchase_transaction && (
                          <Button
                            className="ms-2 p-0"
                            variant="link"
                            size="sm"
                            onClick={() =>
                              handleRedirectPurchase(
                                transaction.purchase_transaction.id_purchase
                              )
                            }
                          >
                            <small>Ver compra</small>
                          </Button>
                        )}
                      </td>
                      <td className="text-end">
                        <>
                          {account.currency.is_monetary && "$ "}
                          {toMoney(transaction.prev_balance)}
                        </>
                      </td>
                      <td className="text-end">
                        <>
                          {account.currency.is_monetary && "$ "}
                          {toMoney(transaction.amount)}
                        </>
                      </td>
                      <td className="text-end">
                        <>
                          {account.currency.is_monetary && "$ "}
                          {toMoney(transaction.post_balance)}
                        </>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    No hay movimientos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <Modal show={isModalOpen} onHide={() => handleClose()}>
            <div className="p-3">
              <h5>Nuevo movimiento</h5>
              <hr />

              <Form onSubmit={handleSubmit}>
                {/* TIPO DE MOVIMIENTO */}
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>Tipo de movimiento</InputGroup.Text>
                  <Form.Select
                    required
                    name="type"
                    onChange={(e: any) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="NEW_PAYMENT">Pago a proveedor</option>
                    <option value="POS_ADJ">
                      Ajuste a favor (disminuye deuda c/ proveedor)
                    </option>
                    <option value="NEG_ADJ">
                      Ajuste en contra (aumenta deuda c/ proveedor)
                    </option>
                  </Form.Select>
                </InputGroup>

                {/* DESCRIPCIÓN */}
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>Descripción</InputGroup.Text>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    required
                    onChange={(e: any) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </InputGroup>

                {/* MONTO */}
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>Monto movimiento</InputGroup.Text>
                  <NumericFormat
                    prefix="$"
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    className="text-end form-control"
                    value={formData.amount}
                    required
                    onValueChange={(values) => {
                      const { floatValue } = values;
                      setFormData({ ...formData, amount: floatValue || 0 });
                    }}
                  />
                </InputGroup>

                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cerrar
                  </Button>
                  <Button size="sm" variant="primary" type="submit">
                    Registrar movimiento
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};
