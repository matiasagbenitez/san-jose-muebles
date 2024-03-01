import { ErrorMessage, useField } from "formik";
import Form from "react-bootstrap/Form";
import "./styles.css";

interface Props {
  label: string;
  name: string;
  placeholder?: string;
  isInvalid?: boolean;
  [x: string]: any;
}

export const MyTextArea = ({ label, ...props }: Props) => {
  const [field] = useField(props);

  return (
    <div className="mb-2">
      <Form.Label htmlFor={props.id || props.name} className="small mb-1">
        {label}
      </Form.Label>

      <Form.Control
        id={props.name}
        autoComplete="off"
        as="textarea"
        {...field}
        {...props}
        isInvalid={props.isInvalid}
        size="sm"
      />
      <ErrorMessage
        name={props.name}
        component="span"
        className="error-message"
      />
    </div>
  );
};
