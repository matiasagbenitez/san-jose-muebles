import { Button, Form, ButtonGroup } from "react-bootstrap";
import { StateReducer, ActionReducer } from "../shared";

interface CountriesFiltersProps {
  state: StateReducer<any>;
  dispatch: React.Dispatch<ActionReducer<any>>;
  handleFiltersChange: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleResetFilters: () => Promise<void>;
    handleCreate: () => void;
}

export const CountriesFilters = ({
  state,
  dispatch,
  handleFiltersChange,
  handleResetFilters,
    handleCreate,
}: CountriesFiltersProps) => {
  return (
    <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
      <div className="d-flex justify-content-between mb-3 gap-2">
        <Form.Control
          name="name"
          autoComplete="off"
          size="sm"
          type="text"
          placeholder="Buscar por nombre"
          value={state.filters.name || ""}
          onChange={(e) =>
            dispatch({
              type: "FILTERS_CHANGE",
              newFilters: { ...state.filters, name: e.target.value },
            })
          }
        />
        <ButtonGroup size="sm">
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
      </div>
    </Form>
  );
};
