import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Accordion, Row, Col } from "react-bootstrap";
import { Options, Kanban, Comments } from "./components";

import apiSJM from "../../../api/apiSJM";
import { DesignStatusBadge } from "../environments/components";
import { LoadingSpinner } from "../../components";
import { DesignEntity } from "./interfaces";
import "./styles.css";

export const Design = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState<DesignEntity | null>(null);
  const [tasks, setTasks] = useState<DesignEntity["tasks"] | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/designs/${id}`);
      setDesign(data.item);
      setTasks(data.item.tasks);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/designs");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return (
    <Fragment>
      {loading && <LoadingSpinner />}
      {!loading && design && tasks && (
        <Fragment>
          <Options />
          <Accordion className="mb-3 p-0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <span className="me-4">
                  Instancia de diseño:{" "}
                  <b>
                    {`${design.type} - ${design.project} - ${design.client}`}
                  </b>
                </span>
                <DesignStatusBadge status={design.status} />
              </Accordion.Header>
              <Accordion.Body className="small">
                {design.description}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Row>
            <Col xs={12} xl={8}>
              <Kanban tasks={tasks} />
            </Col>
            <Col xs={12} xl={4}>
              <Comments />
            </Col>
          </Row>
        </Fragment>
      )}
    </Fragment>
  );
};
