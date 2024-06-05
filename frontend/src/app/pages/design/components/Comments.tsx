import { Fragment } from "react";
import { Button, ListGroup } from "react-bootstrap";

export const Comments = () => {
  return (
    <Fragment>
      <h6 className="mt-3 mt-xl-0">Últimos comentarios o actualizaciones</h6>
      <ListGroup
        className="small mb-3 overflow-auto"
        style={{ height: "calc(100vh - 250px)" }}
      >
        <ListGroup.Item className="d-flex">
          <textarea
            className="form-control"
            placeholder="Escribe un comentario..."
            rows={1}
          ></textarea>
          <Button
            title="Enviar comentario"
            variant="success"
            size="sm"
            className="small ms-2 align-self-end"
          >
            <i className="bi bi-send-fill"></i>
          </Button>
        </ListGroup.Item>
        {Array.from({ length: 10 }).map((_, index) => (
          <ListGroup.Item key={index}>
            <p className="mb-0 fw-bold">
              matiasagbenitez{" "}
              <span className="text-muted fw-normal small fst-italic ms-2">
                hace 7m
              </span>
            </p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
            deserunt, explicabo nulla numquam fugiat placeat perferendis
            inventore hic repellendus rerum, optio quibusdam totam magni nam
            veritatis error in voluptatem alias?
          </ListGroup.Item>
        ))}
        <ListGroup.Item>
          <Button size="sm" variant="link" title="Ver más comentarios">
            Ver todos los comentarios...
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Fragment>
  );
};
