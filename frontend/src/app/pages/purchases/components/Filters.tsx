import {
  Button,
  Form,
  ButtonGroup,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
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
  suppliers: ParamsInterface[];
}

export const Filters = ({
  state,
  dispatch,
  handleFiltersChange,
  handleResetFilters,
  handleCreate,
  suppliers,
}: ProductsFilterProps) => {
  return (
    <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
      <Row>
        <Col xl={9}>
          <Row>
            <Col xl={4}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="from">Proveedor</InputGroup.Text>
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
                >
                  <option value="">Todos los proveedores</option>
                  {suppliers.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>

            <Col xl={2}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="from">Desde</InputGroup.Text>
                <Form.Control
                  type="date"
                  name="from_date"
                  value={state.filters.from_date || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "FILTERS_CHANGE",
                      newFilters: {
                        ...state.filters,
                        from_date: e.target.value,
                      },
                    })
                  }
                />
              </InputGroup>
            </Col>

            <Col xl={2}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="to">Hasta</InputGroup.Text>
                <Form.Control
                  type="date"
                  name="to_date"
                  value={state.filters.to_date || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "FILTERS_CHANGE",
                      newFilters: {
                        ...state.filters,
                        to_date: e.target.value,
                      },
                    })
                  }
                />
              </InputGroup>
            </Col>

            <Col xl={2}>
              <Form.Select
                name="stock"
                size="sm"
                value={state.filters.stock || ""}
                onChange={(e) =>
                  dispatch({
                    type: "FILTERS_CHANGE",
                    newFilters: {
                      ...state.filters,
                      stock: e.target.value,
                    },
                  })
                }
                className="mb-3"
              >
                <option value="">Filtre por stock</option>
                <option value="fully_stocked">Stock recibido</option>
                <option value="not_fully_stocked">Stock pendiente</option>
              </Form.Select>
            </Col>
            <Col xl={2}>
              <Form.Select
                name="nullified"
                size="sm"
                value={state.filters.nullified || ""}
                onChange={(e) =>
                  dispatch({
                    type: "FILTERS_CHANGE",
                    newFilters: {
                      ...state.filters,
                      nullified: e.target.value,
                    },
                  })
                }
                className="mb-3"
              >
                <option value="">Filtre por validez</option>
                <option value="true">Anuladas</option>
                <option value="false">No anuladas</option>
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
              Nueva
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form>
  );
};
