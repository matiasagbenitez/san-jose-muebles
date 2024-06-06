import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import apiSJM from "../../../../api/apiSJM";
import { SweetAlert2 } from "../../../utils";
import { DateFormatter } from "../../../helpers";

import { Button, Col, ListGroup, Row, Spinner } from "react-bootstrap";
import { CustomInput, LoadingSpinner } from "../../../components";
import { Comment } from "../interfaces";

interface CommentForm {
  comment: string;
}

const initialForm: CommentForm = {
  comment: "",
};

interface Props {
  id: string;
}

export const Comments = ({ id }: Props) => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const { user } = useSelector((state: any) => state.auth);

  const fetchComments = useCallback(
    async (newPage: number) => {
      try {
        const { data } = await apiSJM.get(
          `/design_comments/design/${id}/comments`,
          { params: { page: newPage, limit } }
        );
        setPage(newPage);
        setComments((prevComments) =>
          newPage === 1 ? data.items : [...prevComments, ...data.items]
        );
        setTotal(data.total_items);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [id, limit]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchComments(1);
    };
    fetchData();
  }, [id, fetchComments]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await fetchComments(page + 1);
  };

  const handleComment = async (values: CommentForm) => {
    console.log("values", values);
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de comentar?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      setIsFormSubmitted(true);
      const { data } = await apiSJM.post(
        `/design_comments/design/${id}/comments`,
        { ...values }
      );
      setComments((prevComments) => [data.item, ...prevComments]);
      setTotal((prevTotal) => prevTotal + 1);
      SweetAlert2.successToast(data.message);
    } catch (error) {
      console.error("Error posting comment:", error);
      SweetAlert2.errorAlert("¡Error al comentar!");
    } finally {
      setIsFormSubmitted(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de eliminar el comentario?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      const { data } = await apiSJM.delete(
        `/design_comments/design/${id}/comments/${commentId}`
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      setTotal((prevTotal) => prevTotal - 1);
      SweetAlert2.successToast(data.message);
    } catch (error) {
      console.error("Error deleting comment:", error);
      SweetAlert2.errorAlert("¡Error al eliminar el comentario!");
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h6 className="mt-3 mt-xl-0">
            Últimos comentarios o actualizaciones
          </h6>
          <ListGroup
            className="small mb-3 overflow-auto"
            style={{ height: "calc(100vh - 250px)" }}
          >
            <ListGroup.Item>
              <Formik
                initialValues={initialForm}
                onSubmit={(values) => {
                  handleComment(values);
                }}
                validationSchema={Yup.object({
                  comment: Yup.string()
                    .required("El comentario es obligatorio")
                    .max(255, "Máximo 255 caracteres"),
                })}
              >
                {({ values }) => (
                  <Form id="form" className="">
                    <Row className="g-2">
                      <Col xs={10}>
                        <CustomInput.TextArea
                        className="mb-0"
                          name="comment"
                          placeholder="Escribe un comentario (máx. 255 caracteres)..."
                          rows={1}
                          disabled={isFormSubmitted}
                        />
                      </Col>
                      <Col xs={2} className="d-flex align-items-end">
                        <Button
                          type="submit"
                          disabled={isFormSubmitted || values.comment === ""}
                          title="Enviar comentario"
                          variant="success"
                          size="sm"
                          className="small mb-2 align-self-start w-100"
                        >
                          <i className="bi bi-send-fill"></i>
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </ListGroup.Item>
            {comments.map((comment, index) => (
              <ListGroup.Item key={index}>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="mb-0 fw-bold">
                    {comment.user}{" "}
                    <span className="text-muted fw-normal small fst-italic ms-2">
                      {DateFormatter.difference(comment.createdAt)}
                    </span>
                  </span>
                  {user.name === comment.user && (
                    <Button
                      variant="transparent"
                      size="sm"
                      className="p-0"
                      title="Eliminar comentario"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <i className="bi bi-x-circle"></i>
                    </Button>
                  )}
                </div>
                <p className="mb-0 mt-1 small">{comment.comment}</p>
              </ListGroup.Item>
            ))}
            {comments.length < total && (
              <ListGroup.Item className="text-center">
                {loadingMore ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <Button
                    size="sm"
                    variant="link"
                    title="Ver más comentarios"
                    onClick={handleLoadMore}
                  >
                    Cargar más comentarios ({total - comments.length} restantes)
                  </Button>
                )}
              </ListGroup.Item>
            )}
            {comments.length === 0 && (
              <ListGroup.Item className="text-center">
                No hay comentarios.
              </ListGroup.Item>
            )}
          </ListGroup>
        </>
      )}
    </>
  );
};
