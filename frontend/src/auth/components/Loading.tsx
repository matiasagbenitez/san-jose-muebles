import "./Loading.css";

export const Loading = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center w-100 h-100vh"
      style={{
        backgroundImage: "url(/backgrounds/AR_16.webp)",
        height: "100vh",
      }}
    >
      <img
        src="/logos/logo-transparent.png"
        alt="logo"
        height={200}
        style={{
          animation: "spin 3s linear infinite",
        }}
      />
      <p className="mt-2">Verificando credenciales...</p>
    </div>
  );
};
