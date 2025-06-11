import { useState, useEffect } from "react";
import MountainInputWidget from "../../../widgets/mountain/MountainInputWidget";
import { Box } from "@mui/material";
import DatePickerWidget from "widgets/DatePick/DatePickerWidget";
import PhotoUploadWidget from "widgets/PhotoUpload/PhotoUploadWidget";
import dayjs from "dayjs";
import axios from "axios";
import GreenButton from "shared/ui/greenButton";
import GreenInput from "shared/ui/greenInput";
import { useNavigate } from "react-router-dom";

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

const LogWriteForm = ({ userId = 11 }) => {
  const [mountain, setMountain] = useState("");
  const [mountainError, setMountainError] = useState(false);
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState(false); // 추가
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("logWriteForm");
    if (saved) {
      const { mountain, date, content } = JSON.parse(saved);
      if (mountain) setMountain(mountain);
      if (date) setDate(date);
      if (content) setContent(content);
      // photo, photoPreview 등도 필요하면 복원
    }
  }, []);

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
      setDateError(true); // 날짜 에러 처리
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

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("mountainId", mountain);
    formData.append("recordDate", dayjs(date).format("YYYY-MM-DD"));
    formData.append("content", content);
    formData.append("photo", photo);

    try {
      const response = await axios.post("/api/records/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data);
      localStorage.removeItem("logWriteForm");
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  // 산 검색 버튼 클릭 시
  const handleMountainSearch = () => {
    localStorage.setItem(
      "logWriteForm",
      JSON.stringify({
        mountain,
        date,
        content,
        // photo, photoPreview 등도 필요하면 추가
      })
    );
    navigate("/log/write/mountain-search");
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
        minHeight: "60vh",
        maxHeight: "90vh",
        margin: "0 auto",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
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
          value={
            typeof mountain === "object" && mountain !== null
              ? mountain.name
              : mountain
          }
          onChange={(e) => {
            setMountain(e.target.value);
            setMountainError(false);
          }}
          error={mountainError}
          errorMessage="산 이름을 입력해주세요."
          onSearchClick={handleMountainSearch} // 이렇게!
        />
        <Box mt={3} />
        <DatePickerWidget
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setDateError(false); // 날짜 입력 시 에러 해제
          }}
          error={dateError}
          errorMessage="등산 일자를 입력해주세요."
          sx={{
            width: "100%",
            fontSize: "1.1rem",
          }}
        />
        <Box mt={3} />
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
            marginBottom: "1.5rem",
            background: "#f8fff9",
            resize: "vertical",
          }}
        />
        <GreenButton
          type="submit"
          style={{
            background: "#4b8161",
            color: "#ffffff",
            width: "100%",
            fontSize: "1.1rem",
            padding: "1rem 0",
            marginTop: "1rem",
          }}
        >
          기록 저장
        </GreenButton>
      </form>
    </Box>
  );
};

export default LogWriteForm;
