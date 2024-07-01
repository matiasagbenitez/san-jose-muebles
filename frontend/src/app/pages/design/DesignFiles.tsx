import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Design, DesignFile } from "./interfaces";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, SimplePageHeader } from "../../components";
import {
  Button,
  Card,
  Carousel,
  Dropdown,
  DropdownItemText,
  Modal,
  Row,
} from "react-bootstrap";
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
  const [carouselIndex, setCarouselIndex] = useState(0);

  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        apiSJM.get(`/designs/${id}/basic`),
        apiSJM.get(`/design_files/${id}`),
      ]);
      setDesign(res1.data.item);
      setFiles(res2.data.files);
      console.log(res2.data);
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

  const handleImageClick = (index: number) => {
    setCarouselIndex(index);
    setShowCarousel(true);
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
            <Row xs={1} sm={2} lg={4} className="g-3 mt-0">
              {files.map((file, index) => (
                <div key={file.id}>
                  <Card className="file-image" title={file.originalname}>
                    <Card.Header className="py-1 ps-3 pe-2">
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <p className="small m-0 text-truncate text-muted">
                          {file.originalname}
                        </p>
                        <Dropdown>
                          <Dropdown.Toggle
                            id="dropdown-basic"
                            variant="light opacity-50"
                            className="custom-dropdown py-0 px-2"
                            title="Opciones de archivo"
                          >
                            <i className="bi bi-three-dots"></i>
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="small">
                            <Dropdown.Item
                              title="Eliminar archivo"
                              key="delete"
                              className="small"
                              as="button"
                              onClick={() => handleDelete(file.id)}
                            >
                              <i className="bi bi-cloud-minus-fill text-danger fs-6 me-2"></i>
                              <span>Eliminar archivo</span>
                            </Dropdown.Item>
                            <Dropdown.Item
                              title="Descargar archivo"
                              key="download"
                              className="small"
                              as="button"
                              onClick={() => handleDownload(file.fileUrl)}
                            >
                              <i className="bi bi-cloud-arrow-down-fill text-success fs-6 me-2"></i>
                              <span>Descargar archivo</span>
                            </Dropdown.Item>
                            <Dropdown.Divider className="my-1" />
                            <DropdownItemText className="small">
                              <p className="text-muted mb-1 small">
                                <i className="bi bi-person-fill me-2"></i>
                                {file.user}
                              </p>
                              <p className="text-muted mb-0 small">
                                <i className="bi bi-clock-fill me-2"></i>
                                {DateFormatter.toDMYH(file.createdAt)}
                              </p>
                            </DropdownItemText>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                      {file.image ? (
                        <div style={{ height: 250 }}>
                          <Card.Img
                            src={file.fileUrl}
                            height="100%"
                            className="rounded-bottom rounded-0"
                            style={{ objectFit: "cover", cursor: "pointer" }}
                            alt={file.originalname}
                            onClick={() => handleImageClick(index)}
                          />
                        </div>
                      ) : (
                        <div
                          className="position-relative"
                          style={{ height: 250 }}
                        >
                          <i
                            // className="bi bi-file-earmark fs-1"
                            className={
                              file.mimetype.includes("pdf")
                                ? "bi bi-file-earmark-pdf fs-1 text-danger"
                                : file.mimetype.includes("word")
                                ? "bi bi-file-earmark-word fs-1 text-primary"
                                : file.mimetype.includes("excel")
                                ? "bi bi-file-earmark-excel fs-1 text-success"
                                : file.mimetype.includes("zip")
                                ? "bi bi-file-earmark-zip fs-1"
                                : file.mimetype.includes("audio")
                                ? "bi bi-file-earmark-music fs-1"
                                : file.mimetype.includes("video")
                                ? "bi bi-file-earmark-play fs-1"
                                : "bi bi-file-earmark-code fs-1"
                            }
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
          <Modal
            show={showCarousel}
            fullscreen
            onHide={() => setShowCarousel(false)}
          >
            <Modal.Body
              className="p-0 position-relative"
              style={{ backgroundColor: "black" }}
            >
              <div className="d-flex align-items-center justify-content-center h-100">
                <Carousel
                  activeIndex={carouselIndex}
                  onSelect={(selectedIndex) => setCarouselIndex(selectedIndex)}
                  style={{ backgroundColor: "black" }}
                  touch
                  fade
                >
                  {imageFiles.map((image) => (
                    <Carousel.Item key={image.id} interval={5000}>
                      <div className="carousel-image-wrapper">
                        <img
                          src={image.fileUrl}
                          alt={image.originalname}
                          style={{
                            // maxHeight: "calc(100vh - 49px)",
                            maxHeight: "100vh",
                            maxWidth: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>

              <Button
                variant="transparent"
                className="position-absolute top-0 end-0 me-1"
                onClick={() => setShowCarousel(false)}
              >
                <i className="bi bi-x-lg text-white fs-3"></i>
              </Button>
            </Modal.Body>
          </Modal>
        </Fragment>
      )}
    </Fragment>
  );
};
