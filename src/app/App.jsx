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

// ✅ 라우터 (getRoutes 함수 사용)
import getRoutes from "shared/config/routes";

// 페이지
import MountainInfoPage from "../pages/mountainmapping/mountainInfoPage";
import MountainDetailPage from "../pages/mountain/mountainDetailPage";
import LogViewPage from "../pages/record/LogViewPage";
import LogWritePage from "../pages/record/LogWritePage";
import LogMountainSearchPage from "../pages/record/LogMountainSearchModal";
import CommunityPage from "pages/community/communityPage";
import FreeBoardPage from "pages/community/freeBoardPage";
import FreeBoardWritePage from "../pages/community/freeBoardWritePage";
import PostDetailPage from "../pages/community/PostDetailPage";
import GroupPage from "../pages/groupPage";
import OrmiPage from "../pages/ormie/ormiPage";
import NotificationPage from "../pages/notificationPage";
import MyPage from "../pages/mypage/mypage"; // ✅ 너가 원하는 경로
import LoginPage from "../pages/user/LoginPage";
import LogEditPage from "../pages/record/LogEditPage";

function AppContent() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  const isOrmiPage = pathname === "/ormi";
  const isRecordPage =
    pathname === "/log" ||
    pathname === "/log/write" ||
    pathname === "/log/edit" ||
    pathname === "/log/write/mountain-search";
  const isLoginPage = pathname === "/login";

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
      {(isOrmiPage || isRecordPage || isLoginPage) && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: isOrmiPage
              ? "url('/images/back_green.jpg')"
              : isLoginPage
              ? "url('/images/back_green.jpg')"
              : "url('/images/back_paper.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
            zIndex: 0,
          }}
        />
      )}
      <div style={{ display: "flex", position: "relative", zIndex: 1 }}>
        {/* ✅ Sidenav에 getRoutes 함수 사용 */}
        <Sidenav
          color={sidenavColor}
          brand={brand}
          brandName="등산 이야기"
          routes={getRoutes()}
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
            padding: "clamp(1rem, 3vw, 2rem)",
            marginLeft: miniSidenav ? "2em" : "5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            transition: "margin-left 0.3s ease",
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/mountain" replace />} />
            <Route path="/mountain" element={<MountainInfoPage />} />
            <Route path="/mountain/detail/:mountainName" element={<MountainDetailPage />} />
            <Route path="/log" element={<LogViewPage />} />
            <Route path="/log/write" element={<LogWritePage />} />
            <Route path="/log/edit/:recordId" element={<LogEditPage />} />
            <Route path="/log/write/mountain-search" element={<LogMountainSearchPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/free" element={<FreeBoardPage />} />
            <Route path="/community/free/write" element={<FreeBoardWritePage />} />
            <Route path="/community/free/edit/:postId" element={<FreeBoardWritePage />} />
            <Route path="/community/post/:postId" element={<PostDetailPage />} />
            <Route path="/group" element={<GroupPage />} />
            <Route path="/ormi" element={<OrmiPage />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/login" element={<LoginPage />} />
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
      <CacheProvider value={createCache({ key: direction === "rtl" ? "rtl" : "css" })}>
        <ThemeProvider theme={selectedTheme}>
          <CssBaseline />
          <AppContent />
        </ThemeProvider>
      </CacheProvider>
    </SoftUIControllerProvider>
  );
};

export default App;
