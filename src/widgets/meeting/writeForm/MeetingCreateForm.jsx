import { useState, useEffect } from "react";
import { Box, Modal, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GreenInput from "shared/ui/greenInput";
import GreenButton from "shared/ui/greenButton";
import MountainSearchOnlyWidget from "widgets/mountain/MountainSearchOnlyWidget";
import LogMountainSearchModal from "pages/record/LogMountainSearchModal";
import DatePickerYMDWidget from "widgets/DatePick/DatePickerYMDWidget";
import TimePickerHMWidget from "widgets/DatePick/TimePickerHMWidget";
import axiosInstance from "shared/lib/axiosInstance";
import { getUserInfo } from "shared/lib/auth";

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

  const [mountainError, setMountainError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [scheduledDateError, setScheduledDateError] = useState(false);
  const [scheduledDateErrorMsg, setScheduledDateErrorMsg] = useState("");
  const [scheduledTimeError, setScheduledTimeError] = useState(false);
  const [gatherLocationError, setGatherLocationError] = useState(false);
  const [chatLinkError, setChatLinkError] = useState(false);
  const [deadlineDateError, setDeadlineDateError] = useState(false);
  const [deadlineDateErrorMsg, setDeadlineDateErrorMsg] = useState("");

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.userId) {
      setUserId(userInfo.userId);
    } else {
      setUserId(null);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!mountain) {
      setMountainError(true);
      hasError = true;
    } else {
      setMountainError(false);
    }

    if (!title.trim()) {
      setTitleError(true);
      hasError = true;
    } else {
      setTitleError(false);
    }

    if (!description.trim()) {
      setDescriptionError(true);
      hasError = true;
    } else {
      setDescriptionError(false);
    }

    if (!scheduledDate) {
      setScheduledDateError(true);
      setScheduledDateErrorMsg("모임 진행일을 선택해주세요.");
      hasError = true;
    } else if (
      new Date(scheduledDate) <= new Date(new Date().setHours(0, 0, 0, 0))
    ) {
      setScheduledDateError(true);
      setScheduledDateErrorMsg("오늘 이후의 날짜를 선택해주세요.");
      hasError = true;
    } else {
      setScheduledDateError(false);
      setScheduledDateErrorMsg("");
    }

    if (!scheduledTime) {
      setScheduledTimeError(true);
      hasError = true;
    } else {
      setScheduledTimeError(false);
    }

    if (!gatherLocation.trim()) {
      setGatherLocationError(true);
      hasError = true;
    } else {
      setGatherLocationError(false);
    }

    if (!chatLink.trim()) {
      setChatLinkError(true);
      hasError = true;
    } else {
      setChatLinkError(false);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!deadlineDate) {
      setDeadlineDateError(true);
      setDeadlineDateErrorMsg("모임 마감일을 선택해주세요.");
      hasError = true;
    } else {
      const deadline = new Date(deadlineDate);
      deadline.setHours(0, 0, 0, 0);

      const scheduled = scheduledDate ? new Date(scheduledDate) : null;
      if (deadline <= today) {
        setDeadlineDateError(true);
        setDeadlineDateErrorMsg("오늘 이후의 날짜를 선택해주세요.");
        hasError = true;
      } else if (scheduled && deadline >= scheduled) {
        setDeadlineDateError(true);
        setDeadlineDateErrorMsg(
          "진행일 하루 전까지만 마감일로 설정할 수 있습니다."
        );
        hasError = true;
      } else {
        setDeadlineDateError(false);
        setDeadlineDateErrorMsg("");
      }
    }

    if (hasError) return;

    // 등록 전 확인 모달 오픈
    setConfirmModalOpen(true);
  };

  // 실제 등록 처리 함수
  const handleConfirmSubmit = async () => {
    setConfirmModalOpen(false);

    const payload = {
      hostUserId: userId, // 로그인 사용자 정보 사용
      mountainId: mountain?.id,
      location: mountain?.location || "",
      title,
      description,
      scheduledDate,
      scheduledTime,
      deadlineDate,
      gatherLocation,
      maxParticipants,
      chatLink,
    };

    try {
      await axiosInstance.post("/meeting-service/post", payload);
      navigate("/meeting");
    } catch (e) {
      console.error("모임 등록 실패", e);
      alert("모임 등록에 실패했습니다.");
    }
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
            onSearchClick={() => setMountainModalOpen(true)}
            error={mountainError}
            errorMessage="산을 선택해주세요."
          />
        </LabeledField>
        <LogMountainSearchModal
          open={mountainModalOpen}
          onClose={() => setMountainModalOpen(false)}
          onSelect={(mountainObj) => {
            setMountain(mountainObj);
            setMountainError(false); // 에러 해제
          }}
        />

        <LabeledField label="모임 제목">
          <GreenInput
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError(false); // 입력 시 에러 해제
            }}
            maxLength={30}
            placeholder="제목을 입력해주세요"
            error={titleError}
            errorMessage="제목을 작성해주세요."
          />
        </LabeledField>

        <LabeledField
          label="모임 소개"
          description="간단한 모임 소개글을 입력하세요(100자 이내)"
        >
          <GreenInput
            as="textarea"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDescriptionError(false); // 입력 시 에러 해제
            }}
            maxLength={100}
            placeholder="간단한 모임 소개글 (100자 이내)"
            error={descriptionError}
            errorMessage="모임 소개를 입력해주세요."
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
          description="모임이 진행될 날짜를 선택하세요"
        >
          <DatePickerYMDWidget
            value={scheduledDate}
            onChange={(date) => {
              setScheduledDate(date);
              setScheduledDateError(false);
              setScheduledDateErrorMsg("");
            }}
            error={scheduledDateError}
            errorMessage={scheduledDateErrorMsg}
          />
        </LabeledField>

        <LabeledField
          label="예정 시간"
          description="모임 시작 시간을 선택하세요."
        >
          <TimePickerHMWidget
            value={scheduledTime}
            onChange={(val) => {
              setScheduledTime(val);
              setScheduledTimeError(false); // 입력 시 에러 해제
            }}
            error={scheduledTimeError}
            errorMessage="예정 시간을 선택해주세요."
          />
        </LabeledField>

        <LabeledField
          label="집결 장소"
          description="모임 당일 집결할 장소를 입력하세요."
        >
          <GreenInput
            value={gatherLocation}
            onChange={(e) => {
              setGatherLocation(e.target.value);
              setGatherLocationError(false); // 입력 시 에러 해제
            }}
            placeholder="ex) 남산 공영주차장 입구"
            error={gatherLocationError}
            errorMessage="집결 장소를 입력해주세요."
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
              width: "30%",
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
            onChange={(e) => {
              setChatLink(e.target.value);
              setChatLinkError(false); // 입력 시 에러 해제
            }}
            placeholder="오픈채팅 링크"
            error={chatLinkError}
            errorMessage="오픈채팅 링크를 입력해주세요."
          />
        </LabeledField>

        <LabeledField
          label="모임 마감일"
          description="해당 모임의 모집을 마감할 날짜를 선택하세요"
        >
          <DatePickerYMDWidget
            value={deadlineDate}
            onChange={(date) => {
              setDeadlineDate(date);
              setDeadlineDateError(false);
              setDeadlineDateErrorMsg("");
            }}
            error={deadlineDateError}
            errorMessage={deadlineDateErrorMsg}
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

      {/* 등록 전 확인 모달 */}
      <Modal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 320,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" mb={2}>
            모임 진행일, 예정 시간은 등록 후 변경이 불가합니다.
            <br />
            계속 진행하시겠습니까?
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" mt={2}>
            <GreenButton
              type="button"
              style={{
                minWidth: 120,
                fontWeight: 700,
                fontSize: "1.08rem",
                border: "2px solid #70a784",
                background: "#fff",
                color: "#70a784",
                boxShadow: "none",
              }}
              onClick={() => setConfirmModalOpen(false)}
            >
              뒤로가기
            </GreenButton>
            <GreenButton
              type="button"
              style={{
                minWidth: 120,
                fontWeight: 700,
                fontSize: "1.08rem",
              }}
              onClick={handleConfirmSubmit}
            >
              등록하기
            </GreenButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MeetingCreateForm;
