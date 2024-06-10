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
  label: string;
}

interface ProductsFilterProps {
  state: StateReducer<any>;
  dispatch: React.Dispatch<ActionReducer<any>>;
  handleFiltersChange: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleResetFilters: () => Promise<void>;
  handleCreate: () => void;
  clients: ParamsInterface[];
  localities: ParamsInterface[];
}

export const Filters = ({
  state,
  dispatch,
  handleFiltersChange,
  handleResetFilters,
  handleCreate,
  clients,
  localities,
}: ProductsFilterProps) => {
  return (
    <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
      <Row>
        <Col xl={9}>
          <Row>
            <Col xl={4}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="from">Cliente</InputGroup.Text>
                <Form.Select
                  name="client"
                  size="sm"
                  value={state.filters.id_client || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "FILTERS_CHANGE",
                      newFilters: {
                        ...state.filters,
                        id_client: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">Todos los clientes</option>
                  {clients.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>

            <Col xl={4}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="from">Estado proyecto</InputGroup.Text>
                <Form.Select
                  name="status"
                  size="sm"
                  value={state.filters.status || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "FILTERS_CHANGE",
                      newFilters: {
                        ...state.filters,
                        status: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">Por defecto</option>
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="PROCESO">EN PROCESO</option>
                  <option value="PAUSADO">EN PAUSA</option>
                  <option value="FINALIZADO">FINALIZADO</option>
                  <option value="CANCELADO">CANCELADO</option>
                  <option value="ALL">TODOS LOS ESTADOS</option>
                </Form.Select>
              </InputGroup>
            </Col>

            <Col xl={4}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="from">Localidad</InputGroup.Text>
                <Form.Select
                  name="locality"
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
                >
                  <option value="">Todas</option>
                  {localities.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
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
            <Button variant="success" onClick={handleCreate}>
              Nuevo
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form>
  );
};
