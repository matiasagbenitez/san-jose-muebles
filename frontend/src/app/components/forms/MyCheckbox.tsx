import { useField, ErrorMessage } from "formik";

interface Props {
  label: string;
  name: string;
  isInvalid?: boolean;
  [x: string]: any;
}

export const MyCheckbox = ({ label, ...props }: Props) => {
  const [field] = useField({ ...props, type: "checkbox" });
  
  return (
    <div className="mb-1">
      <label className="small">
        <input type="checkbox" {...field} {...props} className="me-2" />
        {label}
      </label>
      <ErrorMessage name={props.name} component="span" />
    </div>
  );
};
