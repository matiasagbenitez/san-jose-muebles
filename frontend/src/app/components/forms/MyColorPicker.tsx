import { ErrorMessage, useField } from "formik";
import Form from "react-bootstrap/Form";
import "./styles.css";

interface Props {
  label: string;
  name: string;
  placeholder?: string;
  type?: "color"; // Cambiado a "color" para el input de color
  isInvalid?: boolean;
  [x: string]: any;
}

export const MyColorInput = ({ label, ...props }: Props) => {
  const [field] = useField(props);

  return (
    <div className="mb-2">
      <Form.Label htmlFor={props.id || props.name} className="small mb-1">
        {label}
      </Form.Label>

      <Form.Control
        id={props.name}
        autoComplete="off"
        {...field}
        {...props}
        isInvalid={props.isInvalid}
        size="sm"
        type="color" // Tipo de input color
      />
      <ErrorMessage
        name={props.name}
        component="span"
        className="error-message"
      />
    </div>
  );
};
