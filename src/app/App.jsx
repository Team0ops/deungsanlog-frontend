import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// UI 컴포넌트
import Sidenav from "widgets/Sidenav";
import SidenavToggleButton from "shared/ui/SidenavToggleButton";

// 컨텍스트
import {
  SoftUIControllerProvider,
  useSoftUIController,
  setMiniSidenav,
} from "shared/context";

// 테마
import theme from "theme";
import themeRTL from "theme/theme-rtl";

// 이미지
import brand from "shared/assets/images/logo_trans.png";

// 라우터
import routes from "shared/config/routes";

// 페이지
import MountainInfoPage from "../pages/mountainInfoPage";
import HikingLogPage from "../pages/hikingLogPage";
import CommunityPage from "../pages/communityPage";
import GroupPage from "../pages/groupPage";
import OrmiPage from "../pages/ormie/ormiPage";
import NotificationPage from "../pages/notificationPage";
import MyPage from "../pages/myPage";

function AppContent() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };
  return (
    <>
      <Sidenav
        color={sidenavColor}
        brand={brand}
        brandName="등산 이야기"
        routes={routes}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      />
      <SidenavToggleButton
        miniSidenav={miniSidenav}
        onClick={() => setMiniSidenav(dispatch, !miniSidenav)}
      />
      <main
        style={{
          flex: 1,
          padding: "2rem",
          marginLeft: miniSidenav ? "150px" : "300px",
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/mountain" replace />} />
          <Route path="/mountain" element={<MountainInfoPage />} />
          <Route path="/log" element={<HikingLogPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/group" element={<GroupPage />} />
          <Route path="/ormi" element={<OrmiPage />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </main>
    </>
  );
}

const App = () => {
  const direction = "ltr";
  const selectedTheme = direction === "rtl" ? themeRTL : theme;

  return (
    <SoftUIControllerProvider>
      <CacheProvider
        value={createCache({ key: direction === "rtl" ? "rtl" : "css" })}
      >
        <ThemeProvider theme={selectedTheme}>
          <CssBaseline />
          <AppContent />
        </ThemeProvider>
      </CacheProvider>
    </SoftUIControllerProvider>
  );
};

export default App;
