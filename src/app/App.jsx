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
import BadgeInfoModalPage from "pages/record/BadgeInfoModalPage";
import LogDetailModalPage from "pages/record/RecordDetailModalPage";
import CommunityPage from "pages/community/communityPage";
import FreeBoardMyPage from "pages/community/FreeBoardMyPage";
import FreeBoardPage from "pages/community/freeBoardPage";
import FreeBoardWritePage from "pages/community/freeBoardWritePage";
import PostDetailPage from "pages/community/PostDetailPage";
import MeetingPage from "pages/meeting/meetingPage";
import MeetingDetailPage from "pages/meeting/meetingDetailPage";
import MeetingCreatePage from "pages/meeting/meetingCreatePage";
import OrmiPage from "pages/ormie/ormiPage";
import NotificationPage from "pages/notificationPage";
import MyPage from "pages/mypage/mypage";
import LoginPage from "pages/user/LoginPage";
import LogEditPage from "pages/record/LogEditPage";

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
  const isCommunityPage = pathname.startsWith("/community");
  const isMeetingPage = pathname.startsWith("/meeting");
  const isNotificationPage = pathname === "/notification";
  const isMyPage = pathname === "/mypage";

  // 배경화면이 필요한 페이지들
  const hasBackgroundPage =
    isOrmiPage ||
    isRecordPage ||
    isLoginPage ||
    isCommunityPage ||
    isMeetingPage ||
    isNotificationPage ||
    isMyPage;

  // 배경화면 이미지 결정
  const getBackgroundImage = () => {
    if (isOrmiPage || isLoginPage || isNotificationPage || isMyPage) {
      return "url('/images/back_green.jpg')";
    } else if (isRecordPage || isCommunityPage || isMeetingPage) {
      return "url('/images/back_paper.jpg')";
    }
    return "none";
  };

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    // 모바일에서만 첫 진입 시 sidenav 닫힘
    if (window.innerWidth < 600) {
      setMiniSidenav(dispatch, true);
    }
  }, []);

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

  // 모바일 여부 체크
  const isMobile = window.innerWidth < 600;

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100vw" }}>
      {hasBackgroundPage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: getBackgroundImage(),
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
            zIndex: 0,
          }}
        />
      )}
      <div style={{ display: "flex", position: "relative", zIndex: 1 }}>
        {/* 모바일: miniSidenav이 false일 때만 Sidenav 오버레이로 표시 */}
        {isMobile ? (
          !miniSidenav && (
            <>
              {/* 오버레이 배경 */}
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  background: "rgba(0,0,0,0.3)",
                  zIndex: 1999,
                }}
                onClick={() => setMiniSidenav(dispatch, true)}
              />
              <div style={{ position: "fixed", top: 0, left: 0, zIndex: 2000 }}>
                <Sidenav
                  color={sidenavColor}
                  brand={brand}
                  brandName="등산 이야기"
                  routes={getRoutes()}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                  onMobileMenuClick={() => setMiniSidenav(dispatch, true)}
                />
              </div>
            </>
          )
        ) : (
          <div>
            <Sidenav
              color={sidenavColor}
              brand={brand}
              brandName="등산 이야기"
              routes={getRoutes()}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
          </div>
        )}
        {/* SidenavToggleButton 위치 반응형 */}
        <div
          style={
            isMobile
              ? {
                  position: "fixed",
                  bottom: "2rem",
                  right: "2rem",
                  zIndex: 2000,
                }
              : { position: "static" }
          }
        >
          <SidenavToggleButton
            miniSidenav={miniSidenav}
            onClick={() => setMiniSidenav(dispatch, !miniSidenav)}
          />
        </div>
        <main
          style={{
            flex: 1,
            padding: "clamp(0.5rem, 4vw, 2rem)",
            marginLeft: isMobile
              ? 0
              : `max(0px, ${miniSidenav ? "2em" : "5rem"})`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            width: "100%",
            transition: "margin-left 0.3s ease",
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/mountain" replace />} />
            <Route path="/mountain" element={<MountainInfoPage />} />
            <Route
              path="/mountain/detail/:mountainName"
              element={<MountainDetailPage />}
            />
            <Route path="/log" element={<LogViewPage />} />
            <Route path="/log/write" element={<LogWritePage />} />
            <Route path="/log/edit/:recordId" element={<LogEditPage />} />
            <Route
              path="/log/write/mountain-search"
              element={<LogMountainSearchPage />}
            />
            <Route path="/log/badge-info" element={<BadgeInfoModalPage />} />
            <Route
              path="/log/detail/:recordId"
              element={<LogDetailModalPage />}
            />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/free/my" element={<FreeBoardMyPage />} />
            <Route path="/community/free" element={<FreeBoardPage />} />
            <Route
              path="/community/free/write"
              element={<FreeBoardWritePage />}
            />
            <Route
              path="/community/free/edit/:postId"
              element={<FreeBoardWritePage />}
            />
            <Route
              path="/community/post/:postId"
              element={<PostDetailPage />}
            />
            <Route path="/meeting" element={<MeetingPage />} />
            <Route
              path="/meeting/detail/:meetingId"
              element={<MeetingDetailPage />}
            />
            <Route path="/meeting/create" element={<MeetingCreatePage />} />
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
