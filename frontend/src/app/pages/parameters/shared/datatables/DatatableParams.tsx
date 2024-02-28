import DataTable, { TableColumn } from "react-data-table-component";
import {
  customStyles,
  paginationOptions,
  ProgressComponent,
  NoDataComponent,
} from ".";
import { useMemo } from "react";

interface DatatableParamsProps {
  title: string;
  columns: TableColumn<any>[];
  data: any;
  loading: boolean;
  totalRows: number;
  handleRowsPerPageChange: (newPerPage: number, page: number) => Promise<void>;
  handlePageChange: (page: number) => Promise<void>;
}

export const DatatableParams = ({
  title,
  columns,
  data,
  loading,
  totalRows,
  handleRowsPerPageChange,
  handlePageChange,
}: DatatableParamsProps) => {
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
        paginationServer
        paginationTotalRows={totalRows}
        paginationComponentOptions={paginationOptions}
        onChangeRowsPerPage={handleRowsPerPageChange}
        onChangePage={handlePageChange}
        customStyles={customStyles}
        paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
      />
    ),
    [
      title,
      columns,
      data,
      loading,
      totalRows,
      handleRowsPerPageChange,
      handlePageChange,
    ]
  );

  return (
    <div className="border rounded" style={{ overflow: "hidden" }}>
      {memoizedDataTable}
    </div>
  );
};
