import { Button, Form, ButtonGroup, Row, Col } from "react-bootstrap";
import { StateReducer, ActionReducer } from "../../../shared";

interface ParamsInterface {
  id: string;
  name: string;
}

interface SuppliersAccountsFiltersProps {
  state: StateReducer<any>;
  dispatch: React.Dispatch<ActionReducer<any>>;
  handleFiltersChange: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleResetFilters: () => Promise<void>;
  currencies: ParamsInterface[];
  suppliers: ParamsInterface[];
}

export const SuppliersAccountsFilters = ({
  state,
  dispatch,
  handleFiltersChange,
  handleResetFilters,
  currencies,
  suppliers,
}: SuppliersAccountsFiltersProps) => {
  return (
    <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
      <Row>
        <Col xl={9}>
          <Row>
            <Col xl={4}>
              <Form.Select
                name="supplier"
                size="sm"
                value={state.filters.id_supplier || ""}
                onChange={(e) =>
                  dispatch({
                    type: "FILTERS_CHANGE",
                    newFilters: {
                      ...state.filters,
                      id_supplier: e.target.value,
                    },
                  })
                }
                className="mb-3"
              >
                <option value="">Todos los proveedores</option>
                {suppliers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xl={4}>
              <Form.Select
                name="currency"
                size="sm"
                value={state.filters.id_currency || ""}
                onChange={(e) =>
                  dispatch({
                    type: "FILTERS_CHANGE",
                    newFilters: {
                      ...state.filters,
                      id_currency: e.target.value,
                    },
                  })
                }
                className="mb-3"
              >
                <option value="">Todas las monedas</option>
                {currencies.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xl={4}>
              <Form.Select
                size="sm"
                className="mb-3"
                name="balance"
                value={state.filters.balance || ""}
                onChange={(e) =>
                  dispatch({
                    type: "FILTERS_CHANGE",
                    newFilters: { ...state.filters, balance: e.target.value },
                  })
                }
              >
                <option value="">Todos los estados</option>
                <option value="positive">Cuentas con saldo a favor</option>
                <option value="negative">Cuentas con saldo negativo</option>
                <option value="zero">Cuentas con saldo en cero</option>
              </Form.Select>
            </Col>
          </Row>
        </Col>

        <Col xl={3} className="mb-3">
          <ButtonGroup size="sm" className="d-flex">
            <Button variant="primary" type="submit">
              Buscar
            </Button>
            <Button variant="secondary" onClick={handleResetFilters}>
              Limpiar
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form>
  );
};
