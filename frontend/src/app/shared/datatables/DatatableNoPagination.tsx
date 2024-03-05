import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles, paginationOptions } from ".";
import { Spinner } from "react-bootstrap";
import { useMemo } from "react";

interface DatatableProps {
  title?: string;
  columns: TableColumn<any>[];
  data: any;
  loading: boolean;
  clickableRows?: boolean;
  onRowClicked?: (row: any) => void;
}

const NoDataComponent = () => {
  return (
    <small className="text-center text-muted mb-3">
      No hay datos para mostrar
    </small>
  );
};

const ProgressComponent = () => {
  return (
    <div
      className="mb-3 d-flex align-items-center"
      style={{ textAlign: "center" }}
    >
      <Spinner animation="grow" variant="secondary" />
      <small className="ms-2 text-muted">Cargando...</small>
    </div>
  );
};

export const DatatableNoPagination = ({
  title,
  columns,
  data,
  loading,
  clickableRows = false,
  onRowClicked,
}: DatatableProps) => {
  const memoizedDataTable = useMemo(
    () => (
      <DataTable
        title={title}
        columns={columns}
        data={data}
        dense
        striped
        noDataComponent={<NoDataComponent />}
        progressPending={loading}
        progressComponent={<ProgressComponent />}
        pagination
        paginationComponentOptions={paginationOptions}
        customStyles={customStyles}
        paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
        highlightOnHover={clickableRows}
        pointerOnHover={clickableRows}
        onRowClicked={clickableRows ? onRowClicked : undefined}
      />
    ),
    [title, columns, data, loading]
  );

  return (
    <div className="border rounded" style={{ overflow: "hidden" }}>
      {memoizedDataTable}
    </div>
  );
};
