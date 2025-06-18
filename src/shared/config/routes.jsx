import MapIcon from "@mui/icons-material/Terrain";
import HikingIcon from "@mui/icons-material/DirectionsWalk";
import CommunityIcon from "@mui/icons-material/Forum";
import GroupIcon from "@mui/icons-material/Group";
import OrmiIcon from "@mui/icons-material/SmartToy";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { isAuthenticated, logout } from "shared/lib/auth";

const getRoutes = () => {
  const baseRoutes = [
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
  ];

  // 로그인 상태별 계정 메뉴
  if (isAuthenticated()) {
    return [
      ...baseRoutes,
      { type: "title", title: "계정" },
      {
        type: "collapse",
        name: "마이페이지",
        key: "mypage",
        route: "/mypage",
        icon: <AccountCircleIcon />,
      },
      {
        type: "action",
        name: "로그아웃",
        key: "logout",
        action: logout,
        icon: <LogoutIcon />,
      },
    ];
  } else {
    return [
      ...baseRoutes,
      { type: "title", title: "계정" },
      {
        type: "collapse",
        name: "로그인",
        key: "login",
        route: "/login",
        icon: <LoginIcon />,
      },
    ];
  }
};

export default getRoutes;
