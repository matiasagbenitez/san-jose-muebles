import { Image } from "react-bootstrap";

export const ProductImage = () => {
  return (
    <div className="mb-3 text-center">
      <Image src="https://placehold.co/250" thumbnail />
      {/* <div className="mt-2 d-flex justify-content-center gap-2">
        <Button size="sm" variant="primary" className="py-0 px-2">
          <small>Subir imagen</small>
        </Button>
        <Button size="sm" variant="danger" className="py-0 px-2">
          <small>Eliminar imagen</small>
        </Button>
      </div> */}
    </div>
  );
};
