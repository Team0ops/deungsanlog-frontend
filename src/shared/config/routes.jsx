import MapIcon from "@mui/icons-material/Terrain";
import HikingIcon from "@mui/icons-material/DirectionsWalk";
import CommunityIcon from "@mui/icons-material/Forum";
import GroupIcon from "@mui/icons-material/Group";
import OrmiIcon from "@mui/icons-material/SmartToy";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";  // ✅ 추가
import { isAuthenticated, logout } from 'shared/lib/auth';  // ✅ 추가

// ✅ 정적 배열 → 동적 함수로 변경
const getRoutes = () => {
  const baseRoutes = [
    // Title: 메인 서비스
    { type: "title", title: "서비스" },
    {
      type: "collapse",
      name: "산 정보",
      key: "mountain",
      route: "/mountain",
      icon: <MapIcon />,
    },
    {
      type: "collapse",
      name: "등산 기록",
      key: "log",
      route: "/log",
      icon: <HikingIcon />,
    },
    {
      type: "collapse",
      name: "커뮤니티",
      key: "community",
      route: "/community",
      icon: <CommunityIcon />,
    },
    {
      type: "collapse",
      name: "모임",
      key: "group",
      route: "/group",
      icon: <GroupIcon />,
    },

    { type: "divider" },

    // Title: 도우미
    { type: "title", title: "도우미" },
    {
      type: "collapse",
      name: "오르미",
      key: "ormi",
      route: "/ormi",
      icon: <OrmiIcon />,
    },
    {
      type: "collapse",
      name: "알림",
      key: "notification",
      route: "/notification",
      icon: <NotificationsIcon />,
    },

    { type: "divider" },

    // Title: 계정
    { type: "title", title: "계정" },
    {
      type: "collapse",
      name: "마이페이지",
      key: "mypage",
      route: "/mypage",
      icon: <AccountCircleIcon />,
    },
  ];

  // ✅ 로그인 상태에 따라 마지막 메뉴 결정
  const authRoute = isAuthenticated() 
    ? {
        type: "action",  // 액션 타입으로 구분
        name: "로그아웃",
        key: "logout", 
        action: logout,  // 클릭 시 실행할 함수
        icon: <LogoutIcon />,
      }
    : {
        type: "collapse",
        name: "로그인",
        key: "login",
        route: "/login",
        icon: <LoginIcon />,
      };

  return [...baseRoutes, authRoute];
};

// ✅ 기본 export를 동적 함수로 변경
export default getRoutes;