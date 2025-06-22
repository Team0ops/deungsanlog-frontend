import { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GreenInput from "shared/ui/greenInput";
import GreenButton from "shared/ui/greenButton";
import MountainSearchOnlyWidget from "widgets/mountain/MountainSearchOnlyWidget";
import LogMountainSearchModal from "pages/record/LogMountainSearchModal";
import DatePickerYMDWidget from "widgets/DatePick/DatePickerYMDWidget";
import TimePickerHMWidget from "widgets/DatePick/TimePickerHMWidget";

// 라벨+설명+필드 컴포넌트
const LabeledField = ({ label, description, children, style }) => (
  <div style={{ marginBottom: "1rem", ...style }}>
    <label
      style={{
        fontWeight: 600,
        fontSize: "1.07rem",
        marginBottom: "0.18rem",
        display: "block",
      }}
    >
      {label}
    </label>
    {description && (
      <div
        style={{
          color: "#6e6e6e",
          fontSize: "0.8rem",
          marginBottom: "0.18rem",
        }}
      >
        {description}
      </div>
    )}
    {children}
  </div>
);

const MeetingCreateForm = () => {
  const navigate = useNavigate();
  const [mountain, setMountain] = useState(null);
  const [mountainModalOpen, setMountainModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [gatherLocation, setGatherLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(8);
  const [chatLink, setChatLink] = useState("");
  const [mountainTouched, setMountainTouched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 유효성 검사 + API 전송 로직
    alert("제출됨 (추후 구현)");
  };

  return (
    <Box
      maxWidth="100vw"
      width="100%"
      p={{ xs: "1rem", md: "2rem" }}
      boxShadow={2}
      borderRadius={3}
      bgcolor="#ffffff"
      sx={{
        maxWidth: { xs: "100vw", md: "700px" },
        margin: "0 auto",
        overflowY: "auto",
      }}
    >
      <form onSubmit={handleSubmit}>
        <LabeledField label="산">
          <MountainSearchOnlyWidget
            value={mountain}
            onChange={setMountain}
            onSearchClick={() => {
              setMountainModalOpen(true);
              setMountainTouched(true);
            }}
            error={mountainTouched && !mountain}
            errorMessage="산을 선택해주세요."
          />
        </LabeledField>
        <LogMountainSearchModal
          open={mountainModalOpen}
          onClose={() => setMountainModalOpen(false)}
          onSelect={(mountainObj) => {
            setMountain(mountainObj);
          }}
        />

        <LabeledField label="모임 제목">
          <GreenInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={30}
            placeholder="제목을 입력해주세요"
            style={{
              fontSize: "1rem",
              fontFamily: "inherit",
              fontWeight: 500,
            }}
          />
        </LabeledField>

        <LabeledField
          label="모임 소개"
          description="간단한 모임 소개글을 입력하세요(100자 이내)"
        >
          <GreenInput
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={100}
            placeholder="간단한 모임 소개글 (100자 이내)"
            style={{
              width: "100%",
              background: "#f8fff9",
              resize: "vertical",
              fontSize: "1rem",
              fontFamily: "inherit",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          />
        </LabeledField>

        <LabeledField
          label="모임 진행일"
          description="모임이 진행될 날짜를 선택하세요."
        >
          <DatePickerYMDWidget
            value={scheduledDate}
            onChange={setScheduledDate}
            required
            error={false}
            errorMessage="날짜를 선택해주세요."
          />
        </LabeledField>

        <LabeledField
          label="예정 시간"
          description="모임 시작 시간을 선택하세요."
        >
          <TimePickerHMWidget
            value={scheduledTime}
            onChange={setScheduledTime}
            required={true}
          />
        </LabeledField>

        <LabeledField
          label="집결 장소"
          description="모임 당일 집결할 장소를 입력하세요."
        >
          <GreenInput
            value={gatherLocation}
            onChange={(e) => setGatherLocation(e.target.value)}
            placeholder="ex) 남산 공영주차장 입구"
            style={{
              width: "100%",
              background: "#f8fff9",
              resize: "vertical",
              fontSize: "1rem",
              fontFamily: "inherit",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          />
        </LabeledField>

        <LabeledField
          label="모임 인원"
          description="최소 3명, 최대 8명 중에서 선택하세요."
        >
          <select
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "0.7em",
              borderRadius: 8,
              border: "2px solid #70a784",
              fontSize: "1.05rem",
              fontFamily: "inherit",
              fontWeight: 500,
              background: "#f8fff9",
              marginBottom: "0.5rem",
            }}
          >
            {[3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num}명
              </option>
            ))}
          </select>
        </LabeledField>

        <LabeledField
          label="오픈채팅 링크"
          description="참여자들이 소통할 카카오 오픈채팅 링크를 생성해 넣어주세요."
        >
          <GreenInput
            value={chatLink}
            onChange={(e) => setChatLink(e.target.value)}
            placeholder="오픈채팅 링크"
          />
        </LabeledField>
        <LabeledField
          label="모임 마감일"
          description="해당 모임의 모집을 마감할 날짜를 선택하세요."
        >
          <DatePickerYMDWidget
            value={deadlineDate}
            onChange={setDeadlineDate}
            required
            error={false}
            errorMessage="날짜를 선택해주세요."
          />
        </LabeledField>
        <GreenButton type="submit" style={{ width: "100%" }}>
          모임 등록하기
        </GreenButton>

        <GreenButton
          type="button"
          style={{
            background: "#72927f",
            color: "#ffffff",
            width: "100%",
            fontSize: "1.05rem",
            padding: "0.8rem 0",
            marginTop: "0.7rem",
          }}
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </GreenButton>
      </form>
    </Box>
  );
};

export default MeetingCreateForm;
