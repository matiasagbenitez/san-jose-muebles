import axios from "axios";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

const info = await import("../../data/data.json");
interface DataRow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;
}

const paginationOptions = {
  rowsPerPageText: "Filas por página",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Todos",
};

const columns: TableColumn<DataRow>[] = [
  {
    name: "ID",
    selector: (row) => row.id,
  },
  {
    name: "First Name",
    selector: (row) => row.first_name,
  },
  {
    name: "Last Name",
    selector: (row) => row.last_name,
  },
  {
    name: "Email",
    selector: (row) => row.email,
  },
  {
    name: "IP Address",
    selector: (row) => row.ip_address,
  },
];

export const Inicio: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    const response = await axios.get(
      `https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`
    );
    setData(response.data.data);
    setTotalRows(response.data.total);
    setLoading(false);
  };

  const handlePageChange = async (page: number) => {
    fetchUsers(page);
  };

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setLoading(true);
    const response = await axios.get(
      `https://reqres.in/api/users?page=${page}&per_page=${newPerPage}`
    );
    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(1); // fetch page 1 of users
  }, []);

  return (
    <div>
      <div className="border border-secondary">
        {/* <DataTable
        title="Usuarios"
          columns={columns}
          data={info.default}
          striped
          selectableRows
          dense
          fixedHeader
          pagination
          paginationComponentOptions={paginationOptions}
        /> */}
        {/* {JSON.stringify(info.default)} */}
        <DataTable
          title="Users"
          striped
          dense
          columns={columns}
          data={data}
          progressPending={loading}
          progressComponent={<h2>Loading loko...</h2>}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
        />
      </div>
    </div>
  );
};
