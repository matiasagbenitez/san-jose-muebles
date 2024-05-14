import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  goBackTo?: string;
  goBackTitle?: string;
  title: string;
  hr?: boolean;
  className?: string;
}

export const SimplePageHeader = ({
  goBackTo,
  goBackTitle,
  title,
  hr = false,
  className,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    goBackTo ? navigate(goBackTo) : navigate(-1);
  };

  return (
    <div className="my-3">
      <Row className={`d-flex align-items-center ${className}`}>
        <Col md={3} lg={2} xxl={1}>
          <Button
            variant="light border text-muted w-100"
            size="sm"
            onClick={handleNavigate}
            title={goBackTitle}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Atrás
          </Button>
        </Col>
        <Col md={9} lg={10} xxl={11}>
          <h1 className="fs-5 mb-0 mt-3 mt-md-0">{title}</h1>
        </Col>
      </Row>

      {hr && <hr className="mt-0 mt-lg-3" />}
    </div>
  );
};
