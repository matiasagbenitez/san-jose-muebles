import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Props {
  path?: string;
  [x: string]: any;
}

export const GoBackButton = ({ path, ...props }: Props) => {
  const navigate = useNavigate();
  return (
    <Button
      size="sm"
      variant="transparent"
      onClick={path ? () => navigate(path) : () => navigate(-1)}
      {...props}
    >
      <i className="bi bi-arrow-left me-2"></i>
      Volver
    </Button>
  );
};
