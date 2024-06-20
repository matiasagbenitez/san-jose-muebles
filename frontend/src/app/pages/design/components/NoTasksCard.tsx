interface Props {
  text?: string;
}

export const NoTaskCard = ({ text }: Props) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <small className="text-muted my-3">No hay tareas {text}</small>
    </div>
  );
};
