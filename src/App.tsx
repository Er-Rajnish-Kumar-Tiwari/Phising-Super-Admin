// import React from "react";
import { RouterProvider } from "react-router-dom";
import { Router } from "./router";

import { ReactQueryProvider } from "./lib/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import 'react-circular-progressbar/dist/styles.css';
// import ReactQuill from 'react-quill-new';
// import 'react-quill/dist/quill.snow.css';
// import 'react-quill-new/dist/quill.snow.css';
function App() {


  return (
    <ReactQueryProvider>
    <RouterProvider router={Router} />
    <Toaster position="top-right" />
  </ReactQueryProvider>
  );
}

export default App;
