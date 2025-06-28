import { useEffect, useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { getUserInfo } from "shared/lib/auth";
import MeetingEditForm from "widgets/meeting/writeForm/MeetingEditForm";

const MeetingEditPage = () => {
  const [userId, setUserId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.userId) {
      setUserId(userInfo.userId);
    } else {
      setUserId(null);
    }
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        overflowY: "auto",
        paddingTop: isMobile ? "1rem" : "2rem",
        paddingBottom: isMobile ? "1rem" : "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "#f9f9f9",
        zIndex: 10,
      }}
    >
      <MeetingEditForm userId={userId} />
    </div>
  );
};

export default MeetingEditPage;
