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

export const ProductsFilter = ({
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
              <Form.Control
                name="brand"
                as="select"
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
              </Form.Control>
            </Col>

            <Col xl={3}>
              <Form.Control
                name="category"
                as="select"
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
              </Form.Control>
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
              <Form.Control
                name="stock"
                as="select"
                size="sm"
                value={state.filters.stock || ""}
                onChange={(e) =>
                  dispatch({
                    type: "FILTERS_CHANGE",
                    newFilters: { ...state.filters, stock: e.target.value },
                  })
                }
                className="mb-3"
              >
                <option value="">Todos los niveles de stock</option>
                <option value="empty">Productos sin stock</option>
                <option value="low">
                  Productos con stock bajo (inferior al mínimo)
                </option>
                <option value="normal">Productos con stock normal</option>
                <option value="high">
                  Productos con stock alto (superior al ideal)
                </option>
              </Form.Control>
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
