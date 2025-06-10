import { useState } from "react";
import MountainInputWidget from "../../../widgets/mountain/MountainInputWidget";
import { Box, TextareaAutosize } from "@mui/material";
import DatePickerWidget from "widgets/DatePick/DatePickerWidget";
import PhotoUploadWidget from "widgets/PhotoUpload/PhotoUploadWidget";
import dayjs from "dayjs";
import axios from "axios";
import GreenButton from "shared/ui/greenButton";

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
  const [mountainError, setMountainError] = useState(false); // 추가
  const [date, setDate] = useState("");
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
    let hasError = false;

    if (!mountain.trim()) {
      setMountainError(true);
      hasError = true;
    } else {
      setMountainError(false);
    }

    if (!photo) {
      setPhotoError(true);
      hasError = true;
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
    } catch (error) {
      console.error("There was an error!", error);
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
            setMountain(e.target.value);
            setMountainError(false);
          }}
          error={mountainError}
          errorMessage="산 이름을 입력해주세요."
        />
        <Box mt={3} />
        <DatePickerWidget
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{
            width: "100%",
            fontSize: "1.1rem",
          }}
        />
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
