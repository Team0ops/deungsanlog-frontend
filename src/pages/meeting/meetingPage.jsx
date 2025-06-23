import MeetingBoardHeader from "widgets/meeting/MeetingHeader";
import MeetingListContainer from "widgets/meeting/MeetingListContainer";

const MeetingPage = () => {
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
        padding: "clamp(1rem, 4vw, 1.5rem)",
        position: "relative",
        height: "calc(100vh - 40px)",
      }}
    >
      <div>
        <MeetingBoardHeader />
        <MeetingListContainer />
      </div>
    </div>
  );
};

export default MeetingPage;
