// pages/meeting/MeetingCreatePage.jsx

import { useEffect, useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { getUserInfo } from "shared/lib/auth";
import MeetingCreateForm from "widgets/meeting/writeForm/MeetingCreateForm";

const MeetingCreatePage = () => {
  const [userId, setUserId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.userId) {
      setUserId(userInfo.userId);
    } else {
      setUserId(null); // 비로그인 시 null
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        overflowY: "auto",
        paddingTop: isMobile ? "1rem" : "2rem",
        paddingBottom: isMobile ? "1rem" : "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "transparent",
      }}
    >
      <MeetingCreateForm userId={userId} />
    </div>
  );
};

export default MeetingCreatePage;
