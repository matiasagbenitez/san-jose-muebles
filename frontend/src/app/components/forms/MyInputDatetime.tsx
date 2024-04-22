import { ErrorMessage, FormikTouched, useField } from "formik";
import Form from "react-bootstrap/Form";
import "./styles.css";

interface Props {
  label: string;
  name: string;
  placeholder?: string;
  isInvalid?: FormikTouched<Date> | undefined;
  [x: string]: any;
}

export const MyInputDatetime = ({ label, ...props }: Props) => {
  const [field] = useField(props);

  const is_invalid = props.isInvalid ? true : false;

  return (
    <div className="mb-2">
      <Form.Label htmlFor={props.id || props.name} className="small mb-1">
        {label}
      </Form.Label>

      <Form.Control
        id={props.name}
        autoComplete="off"
        type="datetime-local"
        {...field}
        {...props}
        isInvalid={is_invalid}
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
