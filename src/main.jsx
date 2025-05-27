import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";

import theme from "./app/styles/theme"; // 커스텀 테마 경로
import "./app/styles/index.css";
import App from "./app/App.jsx";

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("새 버전이 있습니다. 새로고침하시겠습니까?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("앱이 오프라인 모드로 준비되었습니다.");
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
