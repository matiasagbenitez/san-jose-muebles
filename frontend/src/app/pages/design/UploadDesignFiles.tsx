import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Design } from "./interfaces";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, SimplePageHeader } from "../../components";
import { ProjectAccordion } from "./components";
import { useDropzone } from "react-dropzone";
import { Button, Card, Modal, Row } from "react-bootstrap";
import { SweetAlert2 } from "../../utils";
import "./styles.css";

export const UploadDesignFiles = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [maxCount] = useState(10);
  const [maxNameLength] = useState(200);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxCount) {
        SweetAlert2.errorAlert(
          `¡Solo puedes subir hasta ${maxCount} archivos!`
        );
        return;
      }
      const names_ok = acceptedFiles.every(
        (file) => file.name.length <= maxNameLength
      );
      if (!names_ok) {
        SweetAlert2.errorAlert(
          `¡El nombre de los archivos no puede superar los ${maxNameLength} caracteres!`
        );
        return;
      }
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
    [files, maxCount, maxNameLength]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxCount,
  });

  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState<Design | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/designs/${id}/evolutions`);
      setDesign(data.design);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/disenos");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const removeFile = (file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const isImage = (file: File) => {
    return file.type.startsWith("image/");
  };

  const baseStyle = {
    padding: "20px",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#bdbdbd",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
    }),
    []
  );

  const reset = () => {
    setFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      SweetAlert2.errorAlert("¡No hay archivos seleccionados!");
      return;
    }

    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de subir los archivos seleccionados?"
    );
    if (!confirmation.isConfirmed) return;

    try {
      setIsFormSubmitted(true);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const { data } = await apiSJM.post(`/design_files/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      SweetAlert2.successToast(data.message || "¡Archivos subidos!");
      navigate(`/disenos/${id}`);
    } catch (error) {
      console.log(error);
      SweetAlert2.errorAlert("¡Algo salió mal! Inténtalo de nuevo.");
    } finally {
      setIsFormSubmitted(false);
    }
  };

  return (
    <Fragment>
      {loading && <LoadingSpinner />}
      {!loading && id && design && (
        <Fragment>
          <SimplePageHeader
            title="Subir archivos de diseño"
            goBackTo={`/disenos/${id}`}
          />
          <ProjectAccordion design={design} />
          <div className="flex flex-col items-center justify-center mt-3">
            <form className="mx-auto" onSubmit={handleSubmit}>
              <div className="border rounded p-3">
                <div {...getRootProps({ style })}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <i className="bi bi-cloud-arrow-up fs-3"></i>
                      <p className="mb-0">Suelta los archivos aquí...</p>
                    </div>
                  ) : (
                    <>
                      {files.length === 0 ? (
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <i className="bi bi-cloud-arrow-up fs-3"></i>
                          <p className="mb-0">
                            Arrastra y suelta los archivos aquí, o haz clic para
                            seleccionarlos (máximo {maxCount} archivos)
                          </p>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <i className="bi bi-check-circle fs-3"></i>
                          <p className="mb-0">
                            {files.length} archivo(s) seleccionado(s)
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div>
                  <h6 className="mt-3">Archivos seleccionados</h6>
                  {files.length === 0 && (
                    <p className="text-muted small fst-italic">
                      No hay archivos seleccionados
                    </p>
                  )}
                  <Row xs={1} md={2} lg={3} xl={4} className="g-3">
                    {files.map((file, index) => (
                      <div key={index}>
                        <Card className="p-2">
                          {isImage(file) ? (
                            <div
                              className="position-relative"
                              style={{ height: 250 }}
                            >
                              <Card.Img
                                src={URL.createObjectURL(file)}
                                height="100%"
                                style={{ objectFit: "cover" }}
                                title={file.name}
                              />
                              <Button
                                variant="danger"
                                className="px-2 position-absolute top-0 end-0"
                                size="sm"
                                onClick={() => removeFile(file)}
                                title="Eliminar archivo"
                                disabled={isFormSubmitted}
                              >
                                <i className="bi bi-x-circle-fill"></i>
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="position-relative"
                              style={{ height: 250 }}
                              title={file.name}
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
                              <Button
                                variant="danger"
                                className="px-2 position-absolute top-0 end-0"
                                size="sm"
                                onClick={() => removeFile(file)}
                                title="Eliminar archivo"
                              >
                                <i className="bi bi-x-circle-fill "></i>
                              </Button>
                            </div>
                          )}
                          <Card.Body className="d-flex justify-content-between align-items-center pt-2 pb-1">
                            <p className="text-muted small mb-0 text-break">
                              {file.name}
                            </p>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </Row>
                </div>
              </div>
              <div className="mt-3 d-flex justify-content-end gap-2">
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={reset}
                  disabled={files.length === 0 || isFormSubmitted}
                >
                  Limpiar selección
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  disabled={files.length === 0 || isFormSubmitted}
                >
                  <i className="bi bi-cloud-arrow-up me-1"></i>
                  Subir archivos seleccionados
                </Button>
              </div>
            </form>
          </div>
        </Fragment>
      )}

      <Modal show={isFormSubmitted} centered>
        <Modal.Body className="d-flex flex-column align-items-center justify-content-center p-5">
          <p className="text-muted mb-4">
            Se están subiendo los archivos. Por favor, espera...
          </p>
          <span className="loader"></span>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};
