import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import apiSJM from "../../../api/apiSJM";

import { ProjectHeader, EstimateForm } from "./components";
import { LoadingSpinner, PageHeader } from "../../components";
import { CurrencyInterface, EstimateFormInterface, ProyectBasicData } from "./interfaces";

export const ProjectCreateEstimate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProyectBasicData>();
  const [currencies, setCurrencies] = useState<CurrencyInterface>();

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        apiSJM.get(`/projects/${id}/basic`),
        apiSJM.get("/currencies"),
      ]);
      setProject(res1.data.item);
      setCurrencies(res2.data.items);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate(`/proyectos/${id}`);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const submitForm = async (formData: EstimateFormInterface) => {
    setIsFormSubmitting(true);
    console.log(formData);
    setIsFormSubmitting(false);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PageHeader
            goBackTo={`/proyectos/${id}/presupuestos`}
            goBackTitle="Volver a los presupuestos del proyecto"
            title="Crear nuevo presupuesto para el proyecto"
          />

          {project && <ProjectHeader project={project} showStatus={false} />}

          {project && currencies && (
            <EstimateForm
              project={project}
              currencies={currencies}
              isFormSubmitting={isFormSubmitting}
              onSubmit={submitForm}
            />
          )}
        </>
      )}
    </>
  );
};
