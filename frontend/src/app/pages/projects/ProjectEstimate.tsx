import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";
import { Row, Col, Table, Image } from "react-bootstrap";
import { LoadingSpinner, PageHeader } from "../../components";
import { DateFormatter, NumberFormatter } from "../../helpers";
import { CurrencyInterface, ProyectBasicData } from "./interfaces";
import { ProjectHeader } from "./components";

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

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <PageHeader
            goBackTo={`/proyectos/${id}/presupuestos`}
            goBackTitle="Volver al listado de presupuestos"
            title="Presupuesto"
            handleAction={exportPDF}
            actionButtonText="Exportar PDF"
            actionButtonVariant="danger"
            actionButtonIcon="bi-file-pdf"
          />

          {project && <ProjectHeader project={project} showStatus={false} />}

          {project && estimate && currency && (
            <Row className="border rounded mx-0 p-3 border-2 shadow-sm">
              <Col xs={12} md={6} className="d-flex align-items-center gap-4">
                <Image
                  src="/logos/logo-transparent.png"
                  alt="Imagen del proyecto"
                  height={90}
                />
                <div>
                  <h1 className="fs-4 mb-0">SAN JOSÉ MUEBLES</h1>
                  <h5 className="text-muted fst-italic fs-6 mb-0">
                    Nuestra calidad su confianza
                  </h5>
                  <small className="small">
                    25 de Mayo (CP 3363), Misiones, ARG
                  </small>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="d-flex justify-content-center align-items-center h-100">
                  <h2 className="text-uppercase mb-0">Presupuesto</h2>
                </div>
              </Col>
              <Col xs={12} lg={9}></Col>
              <Col xs={12} className="px-3">
                <hr className="my-3" />
                <Row>
                  <Col xs={12}>
                    {estimate.val_date ? (
                      <p className="text-muted">
                        Presupuesto válido desde el{" "}
                        <b>{DateFormatter.toDMY(estimate.gen_date)}</b> hasta el{" "}
                        <b>{DateFormatter.toDMY(estimate.val_date)}</b>. Valores
                        expresados en{" "}
                        <b>
                          {currency.name} ({currency.symbol}).
                        </b>
                      </p>
                    ) : (
                      <p className="text-muted">
                        Presupuesto emitido el{" "}
                        <b>{DateFormatter.toDMY(estimate.gen_date)}</b>. Valores
                        expresados en{" "}
                        <b>
                          {currency.name} ({currency.symbol}).
                        </b>
                      </p>
                    )}
                  </Col>
                  <Col xs={12} md={6}>
                    <b>Cliente: </b> {project.client}
                  </Col>
                  <Col xs={12} md={6}>
                    <b>Localidad proyecto: </b> {project.locality}
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col xs={12}>
                    <b>{estimate.title || "Sin título especificado"}</b>
                  </Col>
                  <Col xs={12}>
                    <small>{estimate.description || "Sin descripción"}</small>
                  </Col>
                </Row>
                <br />
                {items.length > 0 ? (
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
                ) : (
                  <p className="fw-bold">
                    TOTAL FINAL: {currency.symbol}{" "}
                    {NumberFormatter.formatNotsignedCurrency(
                      estimate.currency.is_monetary,
                      estimate.total
                    )}{" "}
                    ({currency.name})
                  </p>
                )}
                <p className="small text-center fst-italic text-muted">
                  {estimate.guarantee}
                </p>
                <p className="small mb-0">
                  <b>Observaciones: </b>
                  {estimate.observations || "Sin observaciones"}
                </p>
                <hr />
                <small className="text-muted fst-italic">
                  Presupuesto con código interno #{estimate.id} emitido por{" "}
                  {estimate.user || "Usuario no especificado"} el{" "}
                  {DateFormatter.toDMY(estimate.created_at)}
                </small>
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
};
