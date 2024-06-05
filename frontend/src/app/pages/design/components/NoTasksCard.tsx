interface Props {
  text?: string;
}

export const NoTaskCard = ({ text }: Props) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <p className="text-muted my-3">No hay tareas {text}</p>
    </div>
  );
};
