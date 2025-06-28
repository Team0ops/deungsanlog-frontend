import { useTheme, useMediaQuery } from "@mui/material";
import MeetingBoardHeader from "widgets/meeting/MeetingHeader";
import MeetingListContainer from "widgets/meeting/MeetingListContainer";

const MeetingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
          ? "clamp(0.8rem, 3vw, 1rem)"
          : "clamp(1rem, 4vw, 1.5rem)",
        position: "relative",
        height: "calc(100vh - 40px)",
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
          height: "100%",
        }}
      >
        <MeetingBoardHeader />
        <MeetingListContainer />
      </div>
    </div>
  );
};

export default MeetingPage;
