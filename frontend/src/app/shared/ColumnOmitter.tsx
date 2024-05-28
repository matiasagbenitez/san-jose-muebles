import React from "react";
import { Dropdown, Form } from "react-bootstrap";

interface ColumnConfig {
  name: string;
  omit: boolean;
}

export interface ColumnsHiddenInterface {
  [key: string]: ColumnConfig;
}

interface Props {
  omittedColumns: ColumnsHiddenInterface;
  setOmittedColumns: (
    value: React.SetStateAction<ColumnsHiddenInterface>
  ) => void;
  py?: boolean;
  icon?: boolean;
}

export const ColumnOmitter = ({
  omittedColumns,
  setOmittedColumns,
  py,
  icon = true,
}: Props) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    setOmittedColumns((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        omit: !checked,
      },
    }));
  };

  return (
    <Dropdown drop="down">
      <Dropdown.Toggle
        size="sm"
        variant="light"
        className={`py-1 border w-100 mt-xl-0 ${py ? "" : "py-xl-0 mt-3"}`}
      >
        {icon && <i className="bi bi-eye"></i>}
        <span className="mx-3">Columnas</span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="small p-0">
        {Object.keys(omittedColumns).map((key) => (
          <Dropdown.ItemText key={key} className="small py-1">
            <Form.Check
              id={key}
              label={omittedColumns[key].name}
              checked={!omittedColumns[key].omit}
              onChange={handleCheckboxChange}
            />
          </Dropdown.ItemText>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
