import { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { DayJsAdapter, toMoney } from "../../../helpers";

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
  amount_in: number;
  amount_out: number;
  type:
    | "NEW_PURCHASE"
    | "X_PURCHASE"
    | "NEW_IN"
    | "NEW_CLIENT_PAYMENT"
    | "X_CLIENT_PAYMENT"
    | "NEW_OUT";
  balance: number;
  createdAt: Date;
  description: string;
  id: number;
  purchase_transaction: {
    id_purchase: number;
  };
  user: {
    name: string;
  };
}

export const SupplierAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [transactions, setTransactions] = useState<
    TransactionInterface[] | null
  >();

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
    navigate(`/proveedores/${id}/cuenta-corriente/nuevo`);
  };

  const handleRedirectPurchase = (id_purchase: number) => {
    navigate(`/compras/${id_purchase}`);
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

          <div>
            Moneda: {account.currency.name} ({account.currency.symbol})
          </div>

          <Table striped bordered hover size="sm" className="small mt-3">
            <thead>
              <tr className="text-center text-uppercase align-middle">
                <th className="px-3">ID</th>
                <th className="col-1">Registrado el</th>
                <th className="col-1">Registrado por</th>
                <th className="col-7">Descripción de la transacción</th>
                <th className="col-1">A cuenta</th>
                <th className="col-1">Pago</th>
                <th className="col-1">Saldo</th>
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
                        {(transaction.amount_in > 0 ||
                          transaction.type === "X_PURCHASE") && (
                          <>
                            {account.currency.is_monetary && "$ "}
                            {toMoney(transaction.amount_in)}
                          </>
                        )}
                      </td>
                      <td className="text-end">
                        {(transaction.amount_out > 0 ||
                          transaction.type === "X_CLIENT_PAYMENT") && (
                          <>
                            {account.currency.is_monetary && "$ "}
                            {toMoney(transaction.amount_out)}
                          </>
                        )}
                      </td>
                      <td className="text-end fw-bold">
                        {account.currency.is_monetary && "$ "}
                        {toMoney(transaction.balance)}
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
        </>
      )}
    </>
  );
};
