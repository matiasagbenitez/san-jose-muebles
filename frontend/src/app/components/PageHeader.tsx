import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  goBackTo?: string;
  goBackTitle?: string;

  title: string;

  handleAction?: () => void;
  actionButtonText?: string;
  actionButtonIcon?: string;
  actionButtonVariant?: string;
  hr?: boolean;
  className?: string;
}

export const PageHeader = ({
  goBackTo,
  goBackTitle,
  title,
  handleAction,
  actionButtonText,
  actionButtonIcon,
  actionButtonVariant = "success",
  hr = true,
  className,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    goBackTo ? navigate(goBackTo) : navigate(-1);
  };

  return (
    <div className={className}>
      <Row className="d-flex align-items-center">
        <Col xs={6} lg={2} xl={1}>
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
        {handleAction && actionButtonText && (
          <Col xs={{ span: 6, order: 1 }} lg={{ span: 2, offset: 1 }}>
            <Button
              size="sm"
              variant={actionButtonVariant}
              onClick={handleAction}
              title={actionButtonText}
              className="w-100"
            >
              {actionButtonIcon && (
                <i className={`bi ${actionButtonIcon} me-2`}></i>
              )}
              {actionButtonText}
            </Button>
          </Col>
        )}
        <Col xs={{ span: 12, order: 2 }} lg={{ span: 7, order: 0 }} xl={8}>
          <h1 className="fs-5 my-3 my-lg-0">{title}</h1>
        </Col>
      </Row>

      {hr && <hr className="mt-0 mt-lg-3" />}
    </div>
  );
};
