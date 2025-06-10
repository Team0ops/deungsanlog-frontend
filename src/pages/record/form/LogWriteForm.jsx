import { useState } from "react";
import GreenInput from "shared/ui/greenInput";
import { Box, Button, TextareaAutosize } from "@mui/material";
import DatePickerWidget from "widgets/DatePick/DatePickerWidget";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PhotoUploadWidget from "widgets/PhotoUpload/PhotoUploadWidget";
import dayjs from "dayjs";
import axios from "axios";

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
  const [recordDate, setRecordDate] = useState(null);
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState(false);

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
    if (!photo) {
      setPhotoError(true);
      setTimeout(() => setPhotoError(false), 600); // 흔들림 후 원복
      return;
    }
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("mountainId", mountain);
    formData.append("recordDate", dayjs(recordDate).format("YYYY-MM-DD"));
    formData.append("content", content);
    formData.append("photo", photo);

    try {
      const response = await axios.post("/api/records/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <Box
      maxWidth={700}
      width="100%"
      p={5}
      boxShadow={2}
      borderRadius={3}
      bgcolor="#ffffff"
    >
      <form onSubmit={handleSubmit}>
        {/* 사진 미리보기 박스 */}
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
        {/* 나머지 입력란 */}
        <GreenInput
          value={mountain}
          onChange={(e) => setMountain(e.target.value)}
          placeholder="산 이름을 입력하세요. 예) 한라산"
          style={{ width: "100%", marginBottom: "1.0rem" }}
        />
        <Box mt={3} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePickerWidget
            label="등산 일자를 선택하세요"
            value={recordDate}
            onChange={setRecordDate}
            sx={{ fontFamily: "'Noto Sans KR', 'Roboto', 'Arial', sans-serif" }}
          />
        </LocalizationProvider>
        <Box mt={3} />
        <TextareaAutosize
          minRows={6}
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            borderRadius: "12px",
            border: "2px solid #4b8161",
            padding: "1.2rem",
            fontSize: "1.1rem",
            marginBottom: "1.5rem",
            background: "#f8fff9",
            resize: "vertical",
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          sx={{
            py: 2,
            fontSize: "1.1rem",
            background: "#4caf50",
            "&:hover": {
              background: "#388e3c",
            },
          }}
        >
          기록 저장
        </Button>
      </form>
    </Box>
  );
};

export default LogWriteForm;
