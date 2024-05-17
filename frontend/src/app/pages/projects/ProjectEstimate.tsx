import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";
import {
  Button,
  ButtonGroup,
  Col,
  Dropdown,
  DropdownButton,
  Row,
  Table,
} from "react-bootstrap";
import { LoadingSpinner } from "../../components";
import { DateFormatter, NumberFormatter } from "../../helpers";
import { CurrencyInterface, ProyectBasicData } from "./interfaces";
import { ProjectHeader } from "./components";
import { SweetAlert2 } from "../../utils";

interface Project {
  id: string;
  title: string;
  client: string;
  locality: string;
  status: "PENDIENTE" | "PAUSADO" | "PROCESO" | "FINALIZADO" | "CANCELADO";
}

interface EstimateItem {
  quantity: number;
  description: string;
  price: number;
  subtotal: number;
}

interface ProjectEstimate {
  id: number;
  project: Project;

  gen_date: Date;
  val_date: Date | null;
  client_name: string;
  title: string;
  description: string | null;
  status: "ACEPTADO" | "PENDIENTE" | "RECHAZADO";

  currency: CurrencyInterface;

  items: EstimateItem[];

  subtotal: number;
  discount: number;
  fees: number;
  total: number;

  guarantee: string;
  observations: string;

  created_at: Date;
  user: string;
}

export const ProjectEstimate = () => {
  const { id, id_estimate } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<ProyectBasicData>();
  const [estimate, setEstimate] = useState<ProjectEstimate>();
  const [currency, setCurrency] = useState<CurrencyInterface>();
  const [items, setItems] = useState<EstimateItem[]>([]);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(
        `/estimates/${id_estimate}/project/${id}`
      );
      setEstimate(data.item);
      setProject(data.item.project);
      setCurrency(data.item.currency);
      setItems(data.item.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      navigate(`/proyectos/${id}/presupuestos`);
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const exportPDF = () => {
    alert("Exportar PDF");
  };

  const handleDeleteEstimate = async () => {
    try {
      const confirmation = await SweetAlert2.confirm(
        "¿Estás seguro de eliminar el presupuesto?"
      );
      if (!confirmation.isConfirmed) return;
      const { data } = await apiSJM.delete(`/estimates/${id_estimate}`);
      SweetAlert2.successToast(data.message);
      navigate(`/proyectos/${id}/presupuestos`);
    } catch (error: any) {
      console.error(error);
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && estimate && (
        <>
          <Row className="d-flex align-items-center">
            <Col xs={6} lg={2} xl={1}>
              <Button
                variant="light border text-muted w-100"
                size="sm"
                onClick={() => navigate(`/proyectos/${id}/presupuestos`)}
                title={"Volver al proyecto"}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Atrás
              </Button>
            </Col>

            <Col xs={{ span: 6, order: 1 }} lg={{ span: 2, offset: 1 }}>
              <DropdownButton
                as={ButtonGroup}
                variant="secondary"
                size="sm"
                className="float-end"
                title="Opciones presupuesto"
              >
                <Dropdown.Item className="small" onClick={exportPDF}>
                  Exportar en PDF
                </Dropdown.Item>
                <Dropdown.Item className="small" onClick={handleDeleteEstimate}>
                  Eliminar presupuesto
                </Dropdown.Item>
              </DropdownButton>
            </Col>

            <Col xs={{ span: 12, order: 2 }} lg={{ span: 7, order: 0 }} xl={8}>
              <h1 className="fs-5 my-3 my-lg-0">Detalle de presupuesto</h1>
            </Col>
          </Row>

          <hr className="mt-0 mt-lg-3" />

          {project && (<ProjectHeader project={project} showStatus={false} />)}

          {project && estimate && currency && (
            <>
              <Table
                bordered
                responsive
                size="sm"
                className="small align-middle"
              >
                <tbody className="text-uppercase">
                  <tr>
                    <th
                      className="col-2 px-2"
                      style={{ backgroundColor: "#F2F2F2" }}
                    >
                      Fecha emisión
                    </th>
                    <td className="col-4 px-2">
                      {DateFormatter.toDMY(estimate.gen_date)}
                    </td>
                    <th
                      className="col-2 px-2"
                      style={{ backgroundColor: "#F2F2F2" }}
                    >
                      Fecha vencimiento
                    </th>
                    <td className="col-4 px-2">
                      {estimate.val_date &&
                        DateFormatter.toDMY(estimate.val_date)}
                    </td>
                  </tr>
                  <tr>
                    <th
                      className="col-2 px-2"
                      style={{ backgroundColor: "#F2F2F2" }}
                    >
                      Cliente
                    </th>
                    <td className="col-4 px-2">{project.client}</td>
                    <th
                      className="col-2 px-2"
                      style={{ backgroundColor: "#F2F2F2" }}
                    >
                      Localidad proyecto
                    </th>
                    <td className="col-4 px-2">{project.locality}</td>
                  </tr>
                </tbody>
              </Table>
              <Table
                bordered
                responsive
                size="sm"
                className="small align-middle"
              >
                <tbody className="text-uppercase">
                  <tr>
                    <th
                      className="col-2 px-2"
                      style={{ backgroundColor: "#F2F2F2" }}
                    >
                      Presupuesto
                    </th>
                    <td className="col-10 px-2">{estimate.title}</td>
                  </tr>
                  <tr>
                    <th
                      className="col-2 px-2"
                      style={{ backgroundColor: "#F2F2F2" }}
                    >
                      Moneda
                    </th>
                    <td className="col-10 px-2">
                      {currency.name} ({currency.symbol})
                    </td>
                  </tr>
                  <tr>
                    <th
                      className="col-2 px-2"
                      style={{ backgroundColor: "#F2F2F2" }}
                    >
                      Total final
                    </th>
                    <td className="col-10 px-2 fw-bold">
                      {currency.symbol}{" "}
                      {NumberFormatter.formatNotsignedCurrency(
                        estimate.currency.is_monetary,
                        estimate.total
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th
                      className="col-2 px-2"
                      style={{ backgroundColor: "#F2F2F2" }}
                    >
                      Descripción
                    </th>
                    <td className="col-10 px-2">{estimate.description}</td>
                  </tr>
                </tbody>
              </Table>
              {items.length > 0 && (
                <Table
                  striped
                  bordered
                  responsive
                  size="sm"
                  className="small align-middle"
                >
                  <thead>
                    <tr className="text-center text-uppercase">
                      <th className="col-1">Cant.</th>
                      <th className="col-5">Descripción</th>
                      <th className="col-3">Precio unitario</th>
                      <th className="col-3">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{item.quantity}</td>
                        <td className="px-2">{item.description}</td>
                        <td className="px-2 text-end">
                          {currency.symbol}{" "}
                          {NumberFormatter.formatNotsignedCurrency(
                            estimate.currency.is_monetary,
                            item.price
                          )}
                        </td>
                        <td className="px-2 text-end">
                          {currency.symbol}{" "}
                          {NumberFormatter.formatNotsignedCurrency(
                            estimate.currency.is_monetary,
                            item.subtotal
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="text-end px-2">
                        Subtotal
                      </td>
                      <td className="text-end px-2">
                        {currency.symbol}{" "}
                        {NumberFormatter.formatNotsignedCurrency(
                          estimate.currency.is_monetary,
                          estimate.subtotal
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-end px-2">
                        Descuento
                      </td>
                      <td className="text-end px-2">
                        {currency.symbol}
                        {" -"}
                        {NumberFormatter.formatNotsignedCurrency(
                          estimate.currency.is_monetary,
                          estimate.discount
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-end px-2">
                        Impuestos
                      </td>
                      <td className="text-end px-2">
                        {currency.symbol}{" "}
                        {NumberFormatter.formatNotsignedCurrency(
                          estimate.currency.is_monetary,
                          estimate.fees
                        )}
                      </td>
                    </tr>
                    <tr className="fw-bold">
                      <td colSpan={3} className="text-end px-2">
                        TOTAL FINAL
                      </td>
                      <td className="text-end px-2">
                        {currency.symbol}{" "}
                        {NumberFormatter.formatNotsignedCurrency(
                          estimate.currency.is_monetary,
                          estimate.total
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
              <Table
                bordered
                responsive
                size="sm"
                className="small align-middle"
              >
                <tbody className="text-uppercase">
                  <tr>
                    <th
                      className="col-2 px-2"
                      style={{ backgroundColor: "#F2F2F2" }}
                    >
                      Garantía
                    </th>
                    <td className="col-10 px-2">{estimate.guarantee}</td>
                  </tr>
                  <tr>
                    <th
                      className="col-2 px-2"
                      style={{ backgroundColor: "#F2F2F2" }}
                    >
                      Observaciones
                    </th>
                    <td className="col-10 px-2">
                      {estimate.observations || ""}
                    </td>
                  </tr>
                </tbody>
              </Table>
              <small className="text-muted">
                <i className="bi bi-clock me-2"></i>
                Presupuesto con ID {estimate.id} generado por{" "}
                {estimate.user || "Usuario no especificado"} el{" "}
                {DateFormatter.toDMYH(estimate.created_at)}.
              </small>
            </>
          )}
        </>
      )}
    </>
  );
};
