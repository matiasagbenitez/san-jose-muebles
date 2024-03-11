import { NewPurchaseForm } from "./components";

export const CreatePurchase = () => {
  const handleSubmit = (formData: any) => {
    console.log(formData);
  };

  return (
    <>
      <h1 className="fs-4">Registrar una nueva compra</h1>
      <hr />
      <NewPurchaseForm onSubmit={handleSubmit} />
    </>
  );
};
