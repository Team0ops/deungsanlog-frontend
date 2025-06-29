import { useEffect, useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { getUserInfo } from "shared/lib/auth";
import FreeBoardForm from "../../widgets/community/writeForm/FreeBoardForm";

const FreeBoardWritePage = () => {
  const [userId, setUserId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 로그인 여부만 체크해서 userId만 저장
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
        padding: isMobile ? "1rem 0.8rem 2rem 0.8rem" : "2rem 1rem 3rem 1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "#f9f9f9",
      }}
    >
      {/* userId를 FreeBoardForm에 prop으로 전달 */}
      <FreeBoardForm userId={userId} />
    </div>
  );
};

export default FreeBoardWritePage;
