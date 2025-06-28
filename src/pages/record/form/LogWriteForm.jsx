import { useState, useEffect } from "react";
import MountainInputWidget from "../../../widgets/mountain/MountainInputWidget";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import DatePickerWidget from "widgets/DatePick/DatePickerWidget";
import PhotoUploadWidget from "widgets/PhotoUpload/PhotoUploadWidget";
import dayjs from "dayjs";
import axiosInstance from "shared/lib/axiosInstance";
import GreenButton from "shared/ui/greenButton";
import GreenInput from "shared/ui/greenInput";
import { useNavigate } from "react-router-dom";
import LogMountainSearchModal from "../LogMountainSearchModal";

const shakeKeyframes = `
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-8px); }
  80% { transform: translateX(8px); }
  100% { transform: translateX(0); }
}
`;

const LogWriteForm = ({
  userId = 11,
  initialMountain = "",
  initialDate = "",
  initialContent = "",
  initialPhoto = null,
  onSubmit,
  recordId,
  isEdit = false,
}) => {
  const [mountain, setMountain] = useState(initialMountain);
  const [mountainError, setMountainError] = useState(false);
  const [date, setDate] = useState(initialDate);
  const [dateError, setDateError] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [contentError, setContentError] = useState(false);
  const [photo, setPhoto] = useState(initialPhoto);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState(false);
  const [mountainModalOpen, setMountainModalOpen] = useState(false);
  const [futureDateError, setFutureDateError] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const saved = localStorage.getItem("logWriteForm");
    if (saved) {
      const { mountain, date, content } = JSON.parse(saved);
      if (mountain) setMountain(mountain);
      if (date) setDate(date);
      if (content) setContent(content);
    } else {
      setMountain(initialMountain);
      setDate(initialDate);
      setContent(initialContent);
      setPhoto(initialPhoto);
      if (initialPhoto && typeof initialPhoto === "string") {
        setPhotoPreview(initialPhoto);
      }
    }
  }, [initialMountain, initialDate, initialContent, initialPhoto]);

  const handlePhotoChange = (e) => {
    setPhotoError(false);
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setPhotoError(false);
    } else {
      setPhoto(null);
      setPhotoPreview(null);
      setPhotoError(false);
    }
  };

  const handleDateChange = (e) => {
    const selected = e.target.value;
    setDate(selected);
    setDateError(false);
    if (selected && dayjs(selected).isAfter(dayjs(), "day")) {
      setFutureDateError(true);
    } else {
      setFutureDateError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    // 산 이름 검증
    if (
      !mountain ||
      (typeof mountain === "string" && !mountain.trim()) ||
      (typeof mountain === "object" &&
        (!mountain.name || !mountain.name.trim()))
    ) {
      setMountainError(true);
      hasError = true;
    } else {
      setMountainError(false);
    }

    if (!date) {
      setDateError(true);
      hasError = true;
    } else {
      setDateError(false);
    }

    if (!photo) {
      setPhotoError(true);
      hasError = true;
    }

    if (!content.trim()) {
      setContentError(true);
      hasError = true;
    } else {
      setContentError(false);
    }

    if (hasError) return;

    // mountainId, mountainName 분리
    let mountainId = "";
    let mountainName = "";
    if (typeof mountain === "object" && mountain !== null) {
      mountainId = mountain.id;
      mountainName = mountain.name;
    } else {
      mountainId = "";
      mountainName = mountain;
    }

    // formData 생성
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("mountainId", mountainId ? mountainId : "");
    formData.append("mountainName", mountainName);
    formData.append("recordDate", dayjs(date).format("YYYY-MM-DD"));
    formData.append("content", content);
    formData.append("photo", photo);

    if (isEdit && onSubmit) {
      // 수정 모드: 부모에서 처리
      formData.append("recordId", recordId); // 반드시 추가!
      try {
        await axiosInstance.put("/record-service/edit", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("기록 수정 완료!");
        localStorage.removeItem("logWriteForm");
        navigate("/log"); // 수정 완료 후 log 페이지로 이동
      } catch (error) {
        console.error("수정 실패", error);
        alert("수정에 실패했습니다. 다시 시도해주세요.");
        navigate(-1); // 실패 시 이전 페이지로 이동
      }
    } else {
      // 등록 모드: 직접 POST
      try {
        const response = await axiosInstance.post(
          "/record-service/post",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert(response.data);
        localStorage.removeItem("logWriteForm");
        navigate("/log");
      } catch (error) {
        console.error("There was an error!", error);
      }
    }
  };

  return (
    <Box
      maxWidth="100vw"
      width="100%"
      p={isMobile ? "0.7rem" : { xs: "1rem", md: "2rem" }}
      boxShadow={2}
      borderRadius={isMobile ? 2 : 3}
      bgcolor="#ffffff"
      sx={{
        maxWidth: { xs: "100vw", md: "700px" },
        minHeight: isMobile ? "70vh" : "60vh",
        maxHeight: isMobile ? "100vh" : "90vh",
        margin: isMobile ? "0" : "0 auto",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <PhotoUploadWidget
          photoPreview={photoPreview}
          photoError={photoError}
          onPhotoChange={handlePhotoChange}
          onPhotoRemove={() => {
            setPhoto(null);
            setPhotoPreview(null);
            setPhotoError(false);
          }}
          shakeKeyframes={shakeKeyframes}
        />
        <MountainInputWidget
          value={mountain}
          onChange={(e) => {
            if (typeof e.target.value === "object") {
              setMountain(e.target.value);
            } else {
              setMountain({ id: null, name: e.target.value, location: "" });
            }
            setMountainError(false);
          }}
          onSearchClick={() => setMountainModalOpen(true)}
          error={mountainError}
          errorMessage="산을 선택해주세요."
        />

        <LogMountainSearchModal
          open={mountainModalOpen}
          onClose={() => setMountainModalOpen(false)}
          onSelect={(mountainObj) => {
            setMountain(mountainObj);
            setMountainError(false);
          }}
        />
        <Box mt={isMobile ? 2 : 3} />
        <DatePickerWidget
          value={date}
          onChange={handleDateChange}
          error={dateError || futureDateError}
          errorMessage={
            dateError
              ? "등산 일자를 입력해주세요."
              : futureDateError
              ? "미래의 날짜는 선택할 수 없습니다."
              : undefined
          }
          sx={{
            width: "100%",
            fontSize: isMobile ? "1rem" : "1.1rem",
          }}
        />
        {futureDateError && (
          <div
            style={{
              color: "#dc3545",
              fontSize: "0.92rem",
              marginLeft: "0.2rem",
            }}
          >
            미래의 날짜는 선택할 수 없습니다.
          </div>
        )}
        <Box mt={isMobile ? 2 : 3} />
        <GreenInput
          as="textarea"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setContentError(false);
          }}
          maxLength={100}
          error={contentError}
          errorMessage="글 내용을 작성해주세요."
          placeholder="내용을 입력하세요. (100자 이내)"
          style={{
            width: "100%",
            border: contentError ? "2px solid #dc3545" : "2px solid #70a784",
            fontFamily: "inherit",
            marginBottom: isMobile ? "1rem" : "1.5rem",
            background: "#f8fff9",
            resize: "vertical",
            fontSize: isMobile ? "1rem" : "1.1rem",
            minHeight: isMobile ? "90px" : "120px",
            padding: isMobile ? "0.7rem" : "1rem",
          }}
        />
        <GreenButton
          type="submit"
          style={{
            background: "#4b8161",
            color: "#ffffff",
            width: "100%",
            fontSize: isMobile ? "1rem" : "1.1rem",
            padding: isMobile ? "0.8rem 0" : "1rem 0",
            marginTop: isMobile ? "0.7rem" : "1rem",
            borderRadius: isMobile ? "10px" : "14px",
          }}
        >
          {isEdit ? "수정 완료" : "기록 저장"}
        </GreenButton>
        <GreenButton
          type="button"
          style={{
            background: "#72927f",
            color: "#ffffff",
            width: "100%",
            fontSize: isMobile ? "0.95rem" : "1.05rem",
            padding: isMobile ? "0.7rem 0" : "0.8rem 0",
            marginTop: isMobile ? "0.5rem" : "0.7rem",
            borderRadius: isMobile ? "10px" : "14px",
          }}
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </GreenButton>
      </form>
    </Box>
  );
};

export default LogWriteForm;
