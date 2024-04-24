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
  visitReasons: ParamsInterface[];
}

export const Filters = ({
  state,
  dispatch,
  handleFiltersChange,
  handleResetFilters,
  handleCreate,
  clients,
  localities,
  visitReasons,
}: ProductsFilterProps) => {
  return (
    <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
      <Row>
        <Col xl={3}>
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

        <Col xl={3}>
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
              <option value="">Todas las localidades</option>
              {localities.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>

        <Col xl={3}>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text id="from">Motivo visita</InputGroup.Text>
            <Form.Select
              name="visit_reason"
              size="sm"
              value={state.filters.id_visit_reason || ""}
              onChange={(e) =>
                dispatch({
                  type: "FILTERS_CHANGE",
                  newFilters: {
                    ...state.filters,
                    id_visit_reason: e.target.value,
                  },
                })
              }
            >
              <option value="">Todas los motivos de visita</option>
              {visitReasons.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>

        <Col xl={3}>
          <Row>
            <Col xs={6}>
              <InputGroup size="sm" className="mb-3">
                {/* <InputGroup.Text id="from">Desde</InputGroup.Text> */}
                <Form.Control
                  type="datetime-local"
                  name="start"
                  value={state.filters.start || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "FILTERS_CHANGE",
                      newFilters: {
                        ...state.filters,
                        start: e.target.value,
                      },
                    })
                  }
                />
              </InputGroup>
            </Col>

            <Col sm={6}>
              <InputGroup size="sm" className="mb-3">
                {/* <InputGroup.Text id="to">Hasta</InputGroup.Text> */}
                <Form.Control
                  type="datetime-local"
                  name="end"
                  value={state.filters.end || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "FILTERS_CHANGE",
                      newFilters: {
                        ...state.filters,
                        end: e.target.value,
                      },
                    })
                  }
                />
              </InputGroup>
            </Col>
          </Row>
        </Col>

        <Col xl={3}>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text id="from">Prioridad</InputGroup.Text>
            <Form.Select
              name="priority"
              size="sm"
              value={state.filters.priority || ""}
              onChange={(e) =>
                dispatch({
                  type: "FILTERS_CHANGE",
                  newFilters: {
                    ...state.filters,
                    priority: e.target.value,
                  },
                })
              }
            >
              <option value="">Todas las prioridades</option>
              <option value="BAJA">BAJA</option>
              <option value="MEDIA">MEDIA</option>
              <option value="ALTA">ALTA</option>
              <option value="URGENTE">URGENTE</option>
            </Form.Select>
          </InputGroup>
        </Col>

        <Col xl={3}>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text id="from">Estado</InputGroup.Text>
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
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="REALIZADA">REALIZADA</option>
              <option value="CANCELADA">CANCELADA</option>
              <option value="ALL">Todos los estados</option>
            </Form.Select>
          </InputGroup>
        </Col>

        <Col xl={3}>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text id="from">Fecha programada</InputGroup.Text>
            <Form.Select
              name="schedule"
              size="sm"
              value={state.filters.schedule || ""}
              onChange={(e) =>
                dispatch({
                  type: "FILTERS_CHANGE",
                  newFilters: {
                    ...state.filters,
                    schedule: e.target.value,
                  },
                })
              }
            >
              <option value="">Todas las opciones</option>
              <option value="NOT_SCHEDULED">Sin fecha programada</option>
              <option value="PARTIAL_SCHEDULED">Con fecha programada</option>
              <option value="FULL_SCHEDULED">Con fecha y hora programada</option>
            </Form.Select>
          </InputGroup>
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
              Nueva
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form>
  );
};
