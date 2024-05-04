import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
} from "../../shared";
import { DayJsAdapter } from "../../../helpers";
import { LoadingSpinner } from "../../components";
import { Button, Col, Modal, Row } from "react-bootstrap";

enum Actions {
  ALTA = "#B5D6A7",
  MODIFICACION = "#FFF47A",
  BAJA = "#F55D1E",
}

interface DataRow {
  id: number;
  action: "ALTA" | "BAJA" | "MODIFICACION";
  before: { [key: string]: any };
  after: { [key: string]: any };
  user: string;
  date: Date;
}

enum keysNames {
  id = "ID",
  end = "FIN",
  start = "INICIO",
  notes = "NOTAS",
  schedule = "HORARIO",
  status = "ESTADO",
  priority = "PRIORIDAD",
  id_client = "ID CLIENTE",
  id_locality = "ID LOCALIDAD",
  address = "DIRECCIÓN",
  id_visit_reason = "ID MOTIVO DE VISITA",
}

export const VisitRequestsHistorial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<DataRow | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(paginationReducer, initialState);
  const endpoint = `/visit_requests/${id}/historial`;

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    setLoading(true);
    await fetchData(endpoint, 1, state, dispatch);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handlePageChange = async (page: number) => {
    dispatch({ type: "PAGE_CHANGE", page });
    fetchData(endpoint, page, state, dispatch);
  };

  const handleRowsPerPageChange = async (newPerPage: number, page: number) => {
    dispatch({ type: "ROWS_PER_PAGE_CHANGE", newPerPage, page });
    fetchData(endpoint, page, { ...state, perPage: newPerPage }, dispatch);
  };

  useEffect(() => {
    if (state.error) {
      navigate("/");
    }
  }, [state.error]);

  const handleClick = (row: DataRow) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  // COLUMNAS Y RENDERIZADO
  const columns: TableColumn<DataRow>[] = [
    {
      name: "ID",
      selector: (row: DataRow) => row.id,
      width: "80px",
      center: true,
    },
    {
      name: "TIPO DE ACCIÓN",
      selector: (row: DataRow) => row.action,
      cell: (row: DataRow) => (
        <span
          style={{
            fontSize: ".9em",
            backgroundColor: Actions[row.action] || "black",
            color: "black",
          }}
          className="badge rounded-pill"
        >
          {row.action}
        </span>
      ),
      center: true,
    },
    {
      name: "REALIZADO POR",
      selector: (row: DataRow) => row.user,
      center: true,
    },
    {
      name: "REALIZADO EL",
      selector: (row: DataRow) => DayJsAdapter.toDayMonthYearHour(row.date),
      center: true,
    },
    {
      name: "VER DETALLES",
      cell: (row: DataRow) => (
        <Button
          variant="secondary"
          className="py-0"
          size="sm"
          onClick={() => handleClick(row)}
        >
          <i className="bi bi-eye"></i>
        </Button>
      ),
      button: true,
    },
  ];

  return (
    <div>
      {loading && <LoadingSpinner />}

      <div className="d-flex gap-3 align-items-center mb-3">
        <Button
          variant="light border text-muted"
          size="sm"
          onClick={() => navigate(`/agenda/${id}`)}
          title="Volver al listado de visitas"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Atrás
        </Button>
        <h1 className="fs-5 my-0">Historial de modificaciones a la visita con ID #{id}</h1>
      </div>

      <Datatable
        title="Historial de modificaciones"
        columns={columns as TableColumn<DataRow>[]}
        data={state.data}
        loading={state.loading}
        totalRows={state.totalRows}
        handleRowsPerPageChange={handleRowsPerPageChange}
        handlePageChange={handlePageChange}
        // clickableRows
        // onRowClicked={handleClick}
      />

      <Modal show={showModal} size="lg" onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la modificación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg={6}>
              <h6>Antes</h6>
              <pre>
                {Object.keys(selectedRow?.before || {}).map((key) => (
                  <div key={key}>
                    <b>
                      {keysNames[key as keyof typeof keysNames] || key}:
                    </b>{" "}
                    {selectedRow?.before[key]}
                  </div>
                ))}
              </pre>
            </Col>
            <Col lg={6}>
              <h6>Después</h6>
              <pre>
                {Object.keys(selectedRow?.after || {}).map((key) => (
                  <div key={key}>
                    <b>
                      {keysNames[key as keyof typeof keysNames] || key}:
                    </b>{" "}
                    {selectedRow?.after[key]}
                  </div>
                ))}
              </pre>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
