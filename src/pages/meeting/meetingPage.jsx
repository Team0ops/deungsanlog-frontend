import { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import MeetingBoardHeader from "widgets/meeting/MeetingHeader";
import MeetingListContainer from "widgets/meeting/MeetingListContainer";
import LoginRequiredModal from "shared/components/LoginRequiredModal";
import { useNavigate } from "react-router-dom";

const MeetingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    setShowLoginModal(false);
    setModalAction("");
    navigate("/login");
  };
  const handleCloseModal = () => {
    setShowLoginModal(false);
    setModalAction("");
  };

  return (
    <div
      style={{
        minWidth: "90%",
        maxWidth: "100%",
        minHeight: "40vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        borderRadius: "20px",
        padding: isMobile
          ? "clamp(0.8rem, 3vw, 1rem) clamp(0.8rem, 3vw, 1rem) clamp(3rem, 8vw, 4rem) clamp(0.8rem, 3vw, 1rem)"
          : "clamp(1rem, 4vw, 1.5rem)",
        position: "relative",
        height: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "1rem" : "1.2rem",
          height: "auto",
        }}
      >
        <MeetingBoardHeader
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
          modalAction={modalAction}
          setModalAction={setModalAction}
        />
        <MeetingListContainer />
      </div>
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={handleCloseModal}
        onLogin={handleLogin}
        title="로그인이 필요한 서비스입니다"
        message={
          modalAction === "create"
            ? "새로운 모임을 만들려면\n로그인이 필요해요!"
            : "나의 모임 참여 현황을 보려면\n로그인이 필요해요!"
        }
      />
    </div>
  );
};

export default MeetingPage;
