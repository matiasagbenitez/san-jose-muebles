interface FiltersParamsProps {
  row: any;
  handleEdit: (row: any) => void;
  handleDelete: (row: any) => void;
}

export const ActionButtons = ({
  row,
  handleEdit,
  handleDelete,
}: FiltersParamsProps) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <button
        title="Modificar"
        className="btn btn-transparent py-0 px-1"
        onClick={() => handleEdit(row)}
      >
        <i className="bi bi-pencil-square text-secondary-emphasis"></i>
      </button>
      <button
        title="Eliminar"
        className="btn btn-transparent py-0 px-1"
        onClick={() => handleDelete(row)}
      >
        <i className="bi bi-x-circle-fill text-danger"></i>
      </button>
    </div>
  );
};
