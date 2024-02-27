import { useEffect, useState } from "react";
import apiSJM from "../../../api/apiSJM";
import { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Button, Form, ButtonGroup } from "react-bootstrap";
import { ParamsDatatable } from "../../components";

interface DataRow {
  id: number;
  name: string;
}

const columns: TableColumn<DataRow>[] = [
  {
    name: "ID",
    selector: (row) => row.id,
    reorder: true,
  },
  {
    name: "Nombre del país",
    selector: (row) => row.name,
    reorder: true,
  },
];

export const Countries = () => {
  const initialFilters = {
    name: "",
  };
  const navigate = useNavigate();
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState(initialFilters);

  const fetchData = async (
    page: number,
    newPerPage?: number,
    newFilters?: any
  ) => {
    setLoading(true);
    try {
      const { data: responseData } = await apiSJM.get("/countries", {
        params: {
          page,
          limit: newPerPage || perPage,
          ...(newFilters || filters),
        },
      });
      setData(responseData.countries);
      setTotalRows(responseData.total);
    } catch (error) {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    fetchData(page);
  };

  const handleRowsPerPageChange = async (newPerPage: number, page: number) => {
    fetchData(page, newPerPage);
    setPerPage(newPerPage);
  };

  const handleFiltersChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData(1);
  };

  const handleResetFilters = async () => {
    setFilters(initialFilters);
    fetchData(1, perPage, initialFilters);
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  return (
    <div>
      <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
        <div className="d-flex justify-content-between m-3 gap-2">
          <Form.Control
            id="name"
            autoComplete="off"
            size="sm"
            type="text"
            placeholder="Buscar por nombre"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          <ButtonGroup size="sm">
            <Button variant="primary" type="submit">
              Buscar
            </Button>
            <Button variant="secondary" onClick={handleResetFilters}>
              Limpiar
            </Button>
            <Button variant="success" onClick={() => alert("Nuevo!")}>
              Nuevo
            </Button>
          </ButtonGroup>
        </div>
      </Form>

      <ParamsDatatable
        title="Países"
        columns={columns}
        data={data}
        loading={loading}
        totalRows={totalRows}
        handleRowsPerPageChange={handleRowsPerPageChange}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};