  //
  // import { createRoot } from "react-dom/client";
  // import App from "./App.tsx";
  // import "./index.css";
  //
  // createRoot(document.getElementById("root")!).render(<App />);
  //


  // src/main.tsx
  import React from 'react';
  import { createRoot } from 'react-dom/client';
  import UploadHarness from './UploadHarness'; // 방금 만든 하네스
  import './index.css'; // 프로젝트에 있으면 유지

  createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <UploadHarness />
      </React.StrictMode>
  );
