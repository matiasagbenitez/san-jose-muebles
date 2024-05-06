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
  brands: ParamsInterface[];
  categories: ParamsInterface[];
}

export const Filters = ({
  state,
  dispatch,
  handleFiltersChange,
  handleResetFilters,
  handleCreate,
  brands,
  categories,
}: ProductsFilterProps) => {
  return (
    <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
      <Row>
        <Col xl={9}>
          <Row>
            <Col xl={3}>
              <Form.Select
                name="category"
                size="sm"
                value={state.filters.id_category || ""}
                onChange={(e) =>
                  dispatch({
                    type: "FILTERS_CHANGE",
                    newFilters: {
                      ...state.filters,
                      id_category: e.target.value,
                    },
                  })
                }
                className="mb-3"
              >
                <option value="">Todas las categorías</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xl={3}>
              <Form.Select
                name="brand"
                size="sm"
                value={state.filters.id_brand || ""}
                onChange={(e) =>
                  dispatch({
                    type: "FILTERS_CHANGE",
                    newFilters: { ...state.filters, id_brand: e.target.value },
                  })
                }
                className="mb-3"
              >
                <option value="">Todas las marcas</option>
                {brands.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xl={3}>
              <Form.Control
                name="text"
                autoComplete="off"
                size="sm"
                type="text"
                placeholder="Filtrar por nombre o código"
                value={state.filters.text || ""}
                onChange={(e) =>
                  dispatch({
                    type: "FILTERS_CHANGE",
                    newFilters: { ...state.filters, text: e.target.value },
                  })
                }
                className="mb-3"
              />
            </Col>

            <Col xl={3}>
              <Form.Select
                size="sm"
                className="mb-3"
                name="status"
                value={state.filters.status || ""}
                onChange={(e) =>
                  dispatch({
                    type: "FILTERS_CHANGE",
                    newFilters: { ...state.filters, status: e.target.value },
                  })
                }
              >
                <option value="OPERATIVO">OPERATIVO</option>
                <option value="RESERVADO">RESERVADO</option>
                <option value="RETIRADO">RETIRADO</option>
                <option value="DESCARTADO">DESCARTADO</option>
                <option value="ALL">Todos</option>
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
