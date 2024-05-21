import { Button, Form, ButtonGroup, Row, Col } from "react-bootstrap";
import { StateReducer, ActionReducer } from "../../../shared";

interface ParamsInterface {
  id: string;
  name: string;
}

interface ProductsFilterProps {
  state: StateReducer<any>;
  dispatch: React.Dispatch<ActionReducer<any>>;
  handleFiltersChange: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleResetFilters: () => Promise<void>;
  handleCreate: () => void;
  localities: ParamsInterface[];
}

export const Filters = ({
  state,
  dispatch,
  handleFiltersChange,
  handleResetFilters,
  handleCreate,
  localities,
}: ProductsFilterProps) => {
  return (
    <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
      <Row>
        <Col xl={9}>
          <Row>
            <Col xl={6}>
              <Form.Control
                name="name"
                autoComplete="off"
                size="sm"
                type="name"
                placeholder="Filtrar por nombre, apellido o teléfono"
                value={state.filters.name || ""}
                onChange={(e) =>
                  dispatch({
                    type: "FILTERS_CHANGE",
                    newFilters: { ...state.filters, name: e.target.value },
                  })
                }
                className="mb-3"
              />
            </Col>

            <Col xl={6}>
              <Form.Select
                name="id_locality"
                size="sm"
                value={state.filters.id_locality || ""}
                onChange={(e) =>
                  dispatch({
                    type: "FILTERS_CHANGE",
                    newFilters: {
                      ...state.filters,
                      id_locality: e.target.value,
                    },
                  })
                }
                className="mb-3"
              >
                <option value="">Todas las localidades</option>
                {localities.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
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
            {/* <Button variant="danger" disabled>
              Reporte
            </Button> */}
            <Button variant="success" onClick={handleCreate}>
              Nuevo
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form>
  );
};
