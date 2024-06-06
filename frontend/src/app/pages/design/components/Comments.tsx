import { useEffect, useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { Comment } from "../interfaces";
import apiSJM from "../../../../api/apiSJM";
import { LoadingSpinner } from "../../../components";
import { DateFormatter } from "../../../helpers";
import { SweetAlert2 } from "../../../utils";

interface Props {
  id: string;
}

export const Comments = ({ id }: Props) => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // No se cambia, así que puede ser constante.
  const [total, setTotal] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const fetchComments = async (newPage: number) => {
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
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchComments(1); // Reset page to 1 when id changes.
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleLoadMore = async () => {
    await fetchComments(page + 1);
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de comentar?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      if (!newComment) return SweetAlert2.errorAlert("¡Comentario vacío!");
      setIsFormSubmitted(true);
      const { data } = await apiSJM.post(
        `/design_comments/design/${id}/comments`,
        {
          comment: newComment,
        }
      );
      setNewComment("");
      setIsFormSubmitted(false);
      setComments((prevComments) => [data.item, ...prevComments]);
      setTotal(total + 1);
      SweetAlert2.successToast(data.message);
    } catch (error) {
      console.error(error);
      SweetAlert2.errorAlert("¡Error al comentar!");
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
            <ListGroup.Item className="d-flex">
              <Form onSubmit={handleComment} className="d-flex w-100">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="form-control form-control-sm"
                  placeholder="Escribe un comentario (máx. 255 caracteres)..."
                  rows={1}
                  disabled={isFormSubmitted}
                  required
                  maxLength={255}
                ></textarea>
                <Button
                  type="submit"
                  disabled={isFormSubmitted || !newComment}
                  title="Enviar comentario"
                  variant="success"
                  size="sm"
                  className="small ms-2 align-self-end"
                >
                  <i className="bi bi-send-fill"></i>
                </Button>
              </Form>
            </ListGroup.Item>
            {comments.map((comment, index) => (
              <ListGroup.Item key={index}>
                <p className="mb-0 fw-bold">
                  {comment.user}{" "}
                  <span className="text-muted fw-normal small fst-italic ms-2">
                    {DateFormatter.difference(comment.createdAt)}
                  </span>
                </p>
                <p className="mb-0 mt-1">{comment.comment}</p>
              </ListGroup.Item>
            ))}
            {comments.length < total && (
              <ListGroup.Item>
                <Button
                  size="sm"
                  variant="link"
                  title="Ver más comentarios"
                  onClick={handleLoadMore}
                >
                  Cargar más comentarios...
                </Button>
              </ListGroup.Item>
            )}
          </ListGroup>
        </>
      )}
    </>
  );
};
