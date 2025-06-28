import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import GreenInput from "shared/ui/greenInput";
import GreenButton from "shared/ui/greenButton";
import DatePickerYMDWidget from "widgets/DatePick/DatePickerYMDWidget";
import axiosInstance from "shared/lib/axiosInstance";

// 라벨+설명+필드 컴포넌트
const LabeledField = ({ label, description, children, style }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div style={{ marginBottom: "1rem", ...style }}>
      <label
        style={{
          fontWeight: 600,
          fontSize: isMobile ? "1rem" : "1.07rem",
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
            fontSize: isMobile ? "0.75rem" : "0.8rem",
            marginBottom: "0.18rem",
          }}
        >
          {description}
        </div>
      )}
      {children}
    </div>
  );
};

const MeetingEditForm = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [deadlineDateError, setDeadlineDateError] = useState(false);
  const [deadlineDateErrorMsg, setDeadlineDateErrorMsg] = useState("");

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const response = await axiosInstance.get(
          `/meeting-service/${meetingId}`
        );
        const meetingData = response.data;

        setTitle(meetingData.title || "");
        setDescription(meetingData.description || "");
        setDeadlineDate(meetingData.deadlineDate || "");
        setScheduledDate(meetingData.scheduledDate || "");
        setLoading(false);
      } catch (error) {
        console.error("모임 정보 조회 실패:", error);
        alert("모임 정보를 불러올 수 없습니다.");
        navigate(-1);
      }
    };

    if (meetingId) {
      fetchMeetingData();
    }
  }, [meetingId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

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

    // 수정 전 확인 모달 오픈
    setConfirmModalOpen(true);
  };

  // 실제 수정 처리 함수
  const handleConfirmSubmit = async () => {
    setConfirmModalOpen(false);

    const payload = {
      title,
      description,
      deadlineDate,
    };

    try {
      await axiosInstance.patch(`/meeting-service/${meetingId}`, payload);
      alert("모임 정보가 수정되었습니다.");
      navigate(`/meeting/${meetingId}`);
    } catch (e) {
      console.error("모임 수정 실패", e);
      alert("모임 수정에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box
      maxWidth="100vw"
      width="100%"
      p={{ xs: "1rem", md: "2rem" }}
      boxShadow={2}
      borderRadius={3}
      bgcolor="#ffffff"
      sx={{
        maxWidth: { xs: "95vw", md: "700px" },
        margin: "0 auto",
        overflowY: "auto",
        minHeight: isMobile ? "auto" : "fit-content",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
        sx={{
          fontSize: isMobile ? "1.3rem" : "1.5rem",
          color: "#4b8161",
          textAlign: "center",
        }}
      >
        모임 정보 수정
      </Typography>

      <form onSubmit={handleSubmit}>
        <LabeledField label="모임 제목">
          <GreenInput
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError(false);
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
              setDescriptionError(false);
            }}
            maxLength={100}
            placeholder="간단한 모임 소개글 (100자 이내)"
            error={descriptionError}
            errorMessage="모임 소개를 입력해주세요."
            style={{
              width: "100%",
              background: "#f8fff9",
              resize: "vertical",
              fontSize: isMobile ? "0.95rem" : "1rem",
              fontFamily: "inherit",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
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
          모임 정보 수정하기
        </GreenButton>

        <GreenButton
          type="button"
          style={{
            background: "#72927f",
            color: "#ffffff",
            width: "100%",
            fontSize: isMobile ? "1rem" : "1.05rem",
            padding: "0.8rem 0",
            marginTop: "0.7rem",
          }}
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </GreenButton>
      </form>

      {/* 수정 전 확인 모달 */}
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
            p: isMobile ? 3 : 4,
            minWidth: isMobile ? "280px" : "320px",
            maxWidth: isMobile ? "90vw" : "400px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            mb={2}
            sx={{
              fontSize: isMobile ? "1.1rem" : "1.25rem",
              lineHeight: 1.4,
            }}
          >
            모임 정보를 수정하시겠습니까?
          </Typography>
          <Box
            display="flex"
            gap={isMobile ? 1 : 2}
            justifyContent="center"
            mt={2}
            flexDirection={isMobile ? "column" : "row"}
          >
            <GreenButton
              type="button"
              style={{
                minWidth: isMobile ? "100%" : 120,
                fontWeight: 700,
                fontSize: isMobile ? "1rem" : "1.08rem",
                border: "2px solid #70a784",
                background: "#fff",
                color: "#70a784",
                boxShadow: "none",
              }}
              onClick={() => setConfirmModalOpen(false)}
            >
              취소
            </GreenButton>
            <GreenButton
              type="button"
              style={{
                minWidth: isMobile ? "100%" : 120,
                fontWeight: 700,
                fontSize: isMobile ? "1rem" : "1.08rem",
              }}
              onClick={handleConfirmSubmit}
            >
              수정하기
            </GreenButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MeetingEditForm;
