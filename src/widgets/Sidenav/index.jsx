import { useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";

import SoftBox from "shared/ui/SoftBox";
import SoftTypography from "shared/ui/SoftTypography";
import SidenavCollapse from "widgets/Sidenav/SidenavCollapse";
import SidenavRoot from "widgets/Sidenav/SidenavRoot";

import { useSoftUIController, setMiniSidenav } from "context";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const location = useLocation();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];

  useEffect(() => {
    function handleMiniSidenav() {
      if (window.innerWidth >= 1200) {
        setMiniSidenav(dispatch, false);
      }
    }

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // ✅ 액션 처리 함수 추가
  const handleActionClick = (action) => {
    if (action && typeof action === "function") {
      console.log("🚪 사이드바에서 액션 실행");
      action(); // logout() 함수 실행
    }
  };

  const renderRoutes = routes.map(
    (
      { type, name, icon, title, noCollapse, key, route, href, action },
      index
    ) => {
      const itemKey = key || `route-${index}`; // fallback key

      if (type === "collapse") {
        return (
          <Box key={itemKey} sx={{ display: "block", p: 0 }}>
            {href ? (
              <Link
                href={href}
                target="_blank"
                rel="noreferrer"
                sx={{ textDecoration: "none", display: "block" }}
              >
                <SidenavCollapse
                  color={color}
                  name={name}
                  icon={icon}
                  active={key === collapseName}
                  noCollapse={noCollapse}
                />
              </Link>
            ) : (
              <NavLink to={route} style={{ textDecoration: "none" }}>
                <SidenavCollapse
                  color={color}
                  name={name}
                  icon={icon}
                  active={key === collapseName}
                  noCollapse={noCollapse}
                />
              </NavLink>
            )}
          </Box>
        );
      }

      // ✅ 액션 타입 처리 추가
      if (type === "action") {
        return (
          <Box
            key={itemKey}
            sx={{
              display: "block",
              p: 0,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "0.5rem",
              },
            }}
            onClick={() => handleActionClick(action)}
          >
            <SidenavCollapse
              color={color}
              name={name}
              icon={icon}
              active={false} // 액션은 항상 비활성 상태
              noCollapse={noCollapse}
            />
          </Box>
        );
      }

      if (type === "title") {
        return (
          <ListItem key={itemKey} disablePadding>
            <SoftTypography
              display="block"
              variant="caption"
              fontWeight="bold"
              textTransform="uppercase"
              opacity={0.6}
              pl={3}
              mt={2}
              mb={1}
              ml={1}
            >
              {title}
            </SoftTypography>
          </ListItem>
        );
      }

      if (type === "divider") {
        return <Divider key={itemKey} />;
      }

      return null;
    }
  );

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, miniSidenav }}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SoftBox pt={3} pb={1} px={3}>
        <SoftBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && (
            <SoftBox
              component="img"
              src={brand}
              alt="Logo"
              width="3.0rem"
              mr={1}
            />
          )}
          {!miniSidenav && (
            <SoftTypography
              component="h6"
              variant="button"
              fontWeight="medium"
              sx={{
                background:
                  "linear-gradient(-45deg, #000000, #11746b, #1d743d, #17352c)",
                backgroundSize: "400% 400%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "waveGradient 5s ease infinite",
                display: "inline-block",
                fontWeight: "bold",
              }}
            >
              {brandName}
            </SoftTypography>
          )}
        </SoftBox>
      </SoftBox>
      <Divider />
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        <List>{renderRoutes}</List>
      </Box>
    </SidenavRoot>
  );
}

export default Sidenav;
