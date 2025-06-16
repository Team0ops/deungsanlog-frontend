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
  onSubmit, // 등록/수정 분기용
  recordId, // 추가
  isEdit = false,
}) => {
  const [mountain, setMountain] = useState(initialMountain);
  const [mountainError, setMountainError] = useState(false);
  const [date, setDate] = useState(initialDate);
  const [dateError, setDateError] = useState(false); // 추가
  const [content, setContent] = useState(initialContent);
  const [contentError, setContentError] = useState(false);
  const [photo, setPhoto] = useState(initialPhoto);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState(false);
  const [mountainModalOpen, setMountainModalOpen] = useState(false);
  const navigate = useNavigate();

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
        await axios.put("http://localhost:8080/record-service/edit", formData, {
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
        const response = await axios.post(
          "http://localhost:8080/record-service/post",
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
          value={mountain}
          onChange={(e) => {
            // e.target.value가 객체인지 문자열인지 체크
            if (typeof e.target.value === "object") {
              setMountain(e.target.value);
            } else {
              setMountain({ id: null, name: e.target.value, location: "" });
            }
            setMountainError(false);
          }}
          error={mountainError}
          errorMessage="산 이름을 입력해주세요."
          onSearchClick={() => setMountainModalOpen(true)}
        />
        <LogMountainSearchModal
          open={mountainModalOpen}
          onClose={() => setMountainModalOpen(false)}
          onSelect={(mountainObj) => setMountain(mountainObj)}
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
          {isEdit ? "수정 완료" : "기록 저장"}
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

export default LogWriteForm;
