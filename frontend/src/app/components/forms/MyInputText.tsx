import { ErrorMessage, useField } from "formik";
import Form from "react-bootstrap/Form";
import "./styles.css";

interface Props {
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  invalid?: string;
  [x: string]: any;
}

export const MyTextInput = ({ label, ...props }: Props) => {
  const [field] = useField(props);
  return (
    <>
      <Form.Label htmlFor={props.id || props.name} className="small">
        {label}
      </Form.Label>

      <Form.Control
        id={props.name}
        autoComplete="off"
        {...field}
        {...props}
        isInvalid={props.invalid ? true : false}
        size="sm"
      />

      <ErrorMessage
        name={props.name}
        component="span"
        className="error-message"
      />
    </>
  );
};
