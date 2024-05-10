import { ErrorMessage, FormikTouched, useField } from "formik";
import Form from "react-bootstrap/Form";
import "./styles.css";
// import ReactDatePicker from "react-datepicker";

interface Props {
  label: string;
  name: string;
  placeholder?: string;
  isInvalid?: FormikTouched<Date> | undefined;
  [x: string]: any;
}

export const MyDatepicker = ({ label, ...props }: Props) => {
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
      {/* <ReactDatePicker
        className="form-control w-100"
        selected={initialForm.start}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={30}
        timeCaption="Hora"
        dateFormat="MMMM d, yyyy h:mm aa"
      /> */}
      <ErrorMessage
        name={props.name}
        component="span"
        className="error-message"
      />
    </div>
  );
};
