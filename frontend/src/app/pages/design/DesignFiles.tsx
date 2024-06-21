import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Design, DesignFile } from "./interfaces";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, SimplePageHeader } from "../../components";
import { Button, Card, Carousel, Modal, Row } from "react-bootstrap";
import { DateFormatter } from "../../helpers";
import { ProjectAccordion } from "./components";
import { SweetAlert2 } from "../../utils";
import "./styles.css";

export const DesignFiles = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [design, setDesign] = useState<Design | null>(null);
  const [files, setFiles] = useState<DesignFile[]>([]);
  const [imageFiles, setImageFiles] = useState<DesignFile[]>([]);
  const [showCarousel, setShowCarousel] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        apiSJM.get(`/designs/${id}/evolutions`),
        apiSJM.get(`/design_files/${id}`),
      ]);
      setDesign(res1.data.design);
      setFiles(res2.data.files);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate(`/disenos/${id}`);
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  useEffect(() => {
    if (!files) return;
    setImageFiles(files.filter((file) => file.image));
  }, [files]);

  const handleDelete = async (id: string) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de eliminar el archivo?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      setDeleting(true);
      const { data } = await apiSJM.delete(`/design_files/${id}`);
      SweetAlert2.successToast(data.message || "¡Archivo eliminado!");
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    } catch (error) {
      console.log(error);
      SweetAlert2.errorAlert("¡No se pudo eliminar el archivo!");
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async (fileUrl: string) => {
    try {
      setDownloading(true);
      window.open(fileUrl, "_blank");
    } catch (error) {
      console.log(error);
      SweetAlert2.errorAlert("¡No se pudo descargar el archivo!");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Fragment>
      {loading && <LoadingSpinner />}
      {!loading && id && design && files && (
        <Fragment>
          <SimplePageHeader
            title="Archivos de diseño subidos"
            goBackTo={`/disenos/${id}`}
          />
          <ProjectAccordion design={design} />
          {files.length === 0 && (
            <p className="text-center mt-3 text-muted">
              El diseño no tiene archivos subidos. ¡Sube archivos para
              visualizarlos aquí!
            </p>
          )}
          {files.length > 0 && (
            <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-3 mt-0">
              {files.map((file) => (
                <div key={file.id}>
                  <Card>
                    {/* <Card.Header>
                      <p className="text-muted text-truncate small mb-0">
                        {file.slug}
                      </p>
                    </Card.Header> */}
                    {file.image ? (
                      <div style={{ height: 250 }}>
                        <Card.Img
                          src={file.fileUrl}
                          height="100%"
                          style={{ objectFit: "cover" }}
                          alt={file.description}
                        />
                      </div>
                    ) : (
                      <div
                        className="position-relative"
                        style={{ height: 250 }}
                      >
                        <i
                          className="bi bi-file-earmark fs-1"
                          style={{
                            fontSize: "3rem",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        ></i>
                      </div>
                    )}
                    <Card.Body className="p-0">
                      <Card.Footer>
                        <div className="d-flex align-items-center justify-content-between">
                          <small className="small text-muted ms-2">
                            {DateFormatter.toDMYH(file.createdAt)}
                          </small>
                          <div>
                            <Button
                              variant="transparent"
                              size="sm"
                              className="px-1 py-0"
                              onClick={() => handleDelete(file.id)}
                              disabled={deleting}
                              title="Eliminar archivo"
                            >
                              <i className="bi bi-cloud-minus-fill text-danger fs-5"></i>
                            </Button>
                            <Button
                              variant="transparent"
                              size="sm"
                              className="ms-1 px-1 py-0"
                              onClick={() => handleDownload(file.fileUrl)}
                              disabled={downloading}
                              title="Descargar archivo"
                            >
                              <i className="bi bi-cloud-arrow-down-fill text-primary fs-5"></i>
                            </Button>
                          </div>
                        </div>
                      </Card.Footer>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Row>
          )}
          <Modal show={deleting || downloading} centered>
            <Modal.Body className="d-flex flex-column align-items-center justify-content-center p-5">
              <p className="text-muted mb-4">
                {deleting
                  ? "Eliminando archivo..."
                  : downloading
                  ? "Descargando archivo..."
                  : ""}
              </p>
              <span className="loader"></span>
            </Modal.Body>
          </Modal>
          <button>
            <i
              className="bi bi-image-fill fs-1"
              onClick={() => setShowCarousel(true)}
            ></i>
          </button>
          <Modal
            show={showCarousel}
            fullscreen
            onHide={() => setShowCarousel(false)}
          >
            <Modal.Body className="p-0">
              <Carousel variant="dark">
                {imageFiles.map((image) => (
                  <Carousel.Item key={image.id} interval={5000}>
                    <div className="carousel-image-wrapper">
                      <img
                        src={image.fileUrl}
                        alt={image.description}
                        style={{ maxHeight: "100vh", objectFit: "contain" }}
                      />
                      <Carousel.Caption>
                        <p>{image.description}</p>
                      </Carousel.Caption>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Modal.Body>
          </Modal>
        </Fragment>
      )}
    </Fragment>
  );
};
