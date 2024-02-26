// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster richColors duration={2000} position={"top-right"} expand />
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);
