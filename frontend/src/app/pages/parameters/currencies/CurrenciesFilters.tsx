import { Button, Form, ButtonGroup, Row, Col } from "react-bootstrap";
import { StateReducer, ActionReducer } from "../shared";

interface CurrenciesFiltersProps {
  state: StateReducer<any>;
  dispatch: React.Dispatch<ActionReducer<any>>;
  handleFiltersChange: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleResetFilters: () => Promise<void>;
  handleCreate: () => void;
}

export const CurrenciesFilters = ({
  state,
  dispatch,
  handleFiltersChange,
  handleResetFilters,
  handleCreate,
}: CurrenciesFiltersProps) => {
  return (
    <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
      <Row>
        <Col xl={9} className="mb-3">
          <Form.Control
            name="name"
            autoComplete="off"
            size="sm"
            type="text"
            placeholder="Buscar por nombre de la moneda o el código"
            value={state.filters.name || ""}
            onChange={(e) =>
              dispatch({
                type: "FILTERS_CHANGE",
                newFilters: { ...state.filters, name: e.target.value },
              })
            }
          />
        </Col>
        <Col xl={3} className="mb-3">
          <ButtonGroup size="sm" className="d-flex">
            <Button variant="primary" type="submit">
              Buscar
            </Button>
            <Button variant="secondary" onClick={handleResetFilters}>
              Limpiar
            </Button>
            <Button variant="success" onClick={handleCreate}>
              Nuevo
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form>
  );
};
