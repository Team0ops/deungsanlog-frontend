// @mui material components
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

// 이름 붙여서 styled 컴포넌트 생성
const SidenavRoot = styled(Drawer)(({ theme, ownerState }) => {
  const { palette, boxShadows, transitions, breakpoints, functions } = theme;
  const { transparentSidenav, miniSidenav } = ownerState;

  const sidebarWidth = 250;
  const { white, transparent } = palette;
  const { xxl } = boxShadows || {}; // 방어용 구조분해
  const { pxToRem } = functions;

  const drawerOpenStyles = () => ({
    transform: "translateX(0)",
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),
    [breakpoints.up("xl")]: {
      backgroundColor: transparent.main,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: sidebarWidth,
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
  });

  const drawerCloseStyles = () => ({
    transform: `translateX(${pxToRem(-320)})`,
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),
    [breakpoints.up("xl")]: {
      backgroundColor: transparentSidenav ? transparent.main : white.main,
      boxShadow: transparentSidenav ? "none" : xxl,
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: pxToRem(96),
      overflowX: "hidden",
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.shorter,
      }),
    },
  });

  return {
    "& .MuiDrawer-paper": {
      position: "fixed",
      top: 0,
      left: 0,
      right: "auto",
      bottom: 0,
      height: "100dvh",
      maxHeight: "100dvh",
      boxSizing: "border-box",
      overflowY: "auto",
      zIndex: 1300,
      willChange: "transform",
      isolation: "isolate",
      boxShadow: theme.shadows[8],
      border: "none",
      ...(miniSidenav ? drawerCloseStyles() : drawerOpenStyles()),
    },
  };
});

export default SidenavRoot;
