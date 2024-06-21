import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Design } from "./interfaces";
import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner, SimplePageHeader } from "../../components";
import { ProjectAccordion } from "./components";
import { useDropzone } from "react-dropzone";
import { Button, Card, Row } from "react-bootstrap";

export const DesignFiles = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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

  return (
    <Fragment>
      {loading && <LoadingSpinner />}
      {!loading && id && design && (
        <Fragment>
          <SimplePageHeader
            title="Archivos y documentos"
            goBackTo={`/disenos/${id}`}
          />
          <ProjectAccordion design={design} />
          <div className="flex flex-col items-center justify-center mt-3">
            <form className="mx-auto">
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
                            seleccionarlos
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
                    <p className="text-muted small fst-italic mb-0">
                      No hay archivos seleccionados
                    </p>
                  )}
                  <Row xs={1} md={2} lg={3} xl={4}>
                    {files.map((file, index) => (
                      <div key={index} className="mb-4">
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
                            <span className="text-muted small">
                              {file.name}
                            </span>
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
                  disabled={files.length === 0}
                >
                  Limpiar selección
                </Button>
                <Button size="sm" type="submit" disabled={files.length === 0}>
                  <i className="bi bi-cloud-arrow-up me-1"></i>
                  Subir archivos seleccionados
                </Button>
              </div>
            </form>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};
