import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { Options, Kanban, Comments, AccordionHeader } from "./components";

import apiSJM from "../../../api/apiSJM";
import { LoadingSpinner } from "../../components";
import { DesignEntity } from "./interfaces";
import "./styles.css";

export const Design = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState<DesignEntity["design"] | null>(null);
  const [tasks, setTasks] = useState<DesignEntity["tasks"] | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/designs/${id}`);
      setDesign(data.item.design);
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
      {!loading && id && design && tasks && (
        <Fragment>
          <Options id={id} />
          <AccordionHeader design={design} />
          <Row>
            <Col xs={12} xl={8}>
              <Kanban tasks={tasks} />
            </Col>
            <Col xs={12} xl={4}>
              <Comments id={id} />
            </Col>
          </Row>
        </Fragment>
      )}
    </Fragment>
  );
};
