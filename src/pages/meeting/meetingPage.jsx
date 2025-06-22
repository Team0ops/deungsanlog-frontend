import { useState } from "react";
import MeetingBoardHeader from "widgets/meeting/MeetingHeader";
import MeetingSearchSection from "widgets/meeting/MeetingSearchSection";

const MeetingPage = () => {
  const [filter, setFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

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
        <MeetingSearchSection
          filter={filter}
          setFilter={setFilter}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />
      </div>
    </div>
  );
};

export default MeetingPage;
