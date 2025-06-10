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
import brand from "shared/assets/images/logo_mountain.png";

// 라우터
import routes from "shared/config/routes";

// 페이지
import MountainInfoPage from "../pages/mountainInfoPage";
import LogViewPage from "../pages/record/LogViewPage";
import LogWritePage from "../pages/record/LogWritePage";
import CommunityPage from "../pages/communityPage";
import GroupPage from "../pages/groupPage";
import OrmiPage from "../pages/ormie/ormiPage";
import NotificationPage from "../pages/notificationPage";
import MyPage from "../pages/user/MyPage";
import LoginPage from "../pages/user/LoginPage";
import KakaoCallback from "../pages/oauth/KakaoCallback";

function AppContent() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  const isOrmiPage = pathname === "/ormi";
  const isRecordPage = pathname === "/log" || pathname === "/log/write"; // 등산 기록 페이지 여부

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
    <div style={{ position: "relative", minHeight: "100vh", width: "100vw" }}>
      {(isOrmiPage || isRecordPage) && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: isOrmiPage
              ? "url('/images/back_green.jpg')"
              : "url('/images/back_paper.jpg')", // record 전용 배경
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
            zIndex: 0,
          }}
        />
      )}
      <div style={{ display: "flex", position: "relative", zIndex: 1 }}>
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
            display: "flex", // 추가
            justifyContent: "center", // 추가
            alignItems: "center", // 추가 (세로 중앙)
            minHeight: "100vh", // 추가 (세로 중앙)
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/mountain" replace />} />
            <Route path="/mountain" element={<MountainInfoPage />} />
            <Route path="/log" element={<LogViewPage />} />
            <Route path="/log/write" element={<LogWritePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/group" element={<GroupPage />} />
            <Route path="/ormi" element={<OrmiPage />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
          </Routes>
        </main>
      </div>
    </div>
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
