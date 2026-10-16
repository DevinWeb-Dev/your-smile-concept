import React from "react";
import ReactDOM from "react-dom/client";

import { HashRouter } from "react-router-dom";

import App from "./App.jsx";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";
import SmileRouteQuality from "./components/SmileRouteQuality.jsx";

import "./index.css";
import "./styles/smile-final-polish.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <HashRouter>
      <AppErrorBoundary>
        <SmileRouteQuality />
        <App />
      </AppErrorBoundary>
    </HashRouter>
  </React.StrictMode>
);