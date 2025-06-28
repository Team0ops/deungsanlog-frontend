import { useState, useEffect } from "react";
import { getUserInfo } from "shared/lib/auth";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import GreenButton from "shared/ui/greenButton";

const NotLoggedIn = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      width="100%"
      maxWidth="600px"
      mx="auto"
      bgcolor="#f8f9fa"
      borderRadius={3}
      p={isMobile ? 3 : 4}
      boxShadow="0 2px 8px rgba(0,0,0,0.1)"
      border="1px solid #e9ecef"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        maxWidth="400px"
        width="100%"
      >
        <Box
          sx={{
            color: "#495057",
            fontWeight: 500,
            fontSize: isMobile ? "1.1rem" : "1.3rem",
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          로그인을 하면 다른 등산러들과 소통할 수 있어요!!
          <br />
          소통을 알림으로 받아보세요~ 🔔
        </Box>
        <GreenButton
          onClick={() => (window.location.href = "/login")}
          style={{
            color: "#8cac7f",
            fontSize: isMobile ? "1rem" : "1.2rem",
            background: "#f5f5f5",
            padding: isMobile ? "0.8rem 2rem" : "1rem 2.5rem",
            whiteSpace: "nowrap",
            border: "1px solid #dee2e6",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          로그인 하러가기
        </GreenButton>
      </Box>
    </Box>
  );
};

const NotificationPage = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.userId) {
      setUserId(userInfo.userId);
    }
  }, []);

  if (!userId) return <NotLoggedIn />;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      width="100%"
      maxWidth="600px"
      mx="auto"
      bgcolor="#f8f9fa"
      borderRadius={3}
      p={3}
      boxShadow="0 2px 8px rgba(0,0,0,0.1)"
      border="1px solid #e9ecef"
    >
      <Box
        sx={{
          color: "#495057",
          fontWeight: 500,
          fontSize: "1.3rem",
          textAlign: "center",
        }}
      >
        알림페이지입니다 🏔️
        <br />
        <span style={{ fontSize: "1rem", color: "#6c757d" }}>
          알림 기능은 준비 중입니다...
        </span>
      </Box>
    </Box>
  );
};

export default NotificationPage;

