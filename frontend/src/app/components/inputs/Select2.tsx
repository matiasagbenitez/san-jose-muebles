import { ErrorMessage, useField } from "formik";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import "./styles.css";

interface Option {
  id: string;
  label: string;
}

interface Props {
  label?: string;
  name: string;
  placeholder?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  options: Option[];
  onChange: (option: Option) => void;
  [x: string]: any;
}

export const Select2 = ({
  label,
  isRequired,
  placeholder = "Seleccione una opción...",
  options,
  onChange,
  ...props
}: Props) => {
  const [field, _, helpers] = useField(props);

  const handleChange = (option: any) => {
    helpers.setValue(option.id);
    onChange(option);
  };

  const selectedOption = options.find(option => option.id === field.value);

  return (
    <div className="mb-2">
      {label && (
        <Form.Label htmlFor={props.id || props.name} className="small mb-1">
          {label} {isRequired && <span className="text-danger">*</span>}
        </Form.Label>
      )}

      <Select
        id={props.name}
        required={isRequired}
        placeholder={placeholder}
        options={options}
        value={selectedOption}
        onChange={handleChange}
        getOptionValue={(option) => option.id}
        styles={{
          control: (_provided, _state) => ({
            height: "31px",
            minHeight: "31px",
            border: props.isInvalid ? "1px solid red" : "1px solid #ced4da",
            borderRadius: "0.25rem",
            fontSize: "0.85rem",
            display: "flex",
          }),
          menu: (provided, _state) => ({
            ...provided,
            fontSize: "0.9rem",
          }),
        }}
        {...props}
      />
      
      <ErrorMessage
        name={props.name}
        component="span"
        className="error-message"
      />
    </div>
  );
};
