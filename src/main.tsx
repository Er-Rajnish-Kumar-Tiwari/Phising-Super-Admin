import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, RouterProvider } from "react-router-dom";
// import { Router } from "./router";

// import { ReactQueryProvider } from "./lib/ReactQueryProvider";
// import { Toaster } from "react-hot-toast";
import App from "./App";
// import 'index.css'
// import 'react-quill/dist/quill.snow.css';
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
 
    <App/>

);
