import { useState } from "react";
import { Box } from "@mui/material";
import GreenButton from "shared/ui/greenButton";
import GreenInput from "shared/ui/greenInput";
import MountainInputWidget from "widgets/mountain/MountainInputWidget";
import PhotoUploadWidget from "widgets/PhotoUpload/PhotoUploadWidget";
import LogMountainSearchModal from "pages/record/LogMountainSearchModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FreeBoardWriteForm = () => {
  const [title, setTitle] = useState("");
  const [mountain, setMountain] = useState(null);
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [mountainError, setMountainError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [mountainModalOpen, setMountainModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!mountain || !mountain.name?.trim()) {
      setMountainError(true);
      isValid = false;
    }

    if (!content.trim()) {
      setContentError(true);
      isValid = false;
    }

    if (!title.trim()) {
      setTitleError(true);
      isValid = false;
    }

    if (!isValid) return;

    try {
      // 이미지 먼저 업로드
      let imageUrls = [];
      if (photo) {
        const formData = new FormData();
        formData.append("images", photo);
        const res = await axios.post(
          "http://localhost:8080/community-service/posts/upload-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        imageUrls = res.data;
      }

      const payload = {
        userId: 11,
        type: 0, // 자유게시판
        mountainId: mountain?.id || null,
        title,
        content,
        imageUrls,
      };

      await axios.post(
        "http://localhost:8080/community-service/posts",
        payload
      );
      alert("게시글 등록 완료!");
      navigate("/community/free");
    } catch (error) {
      console.error("게시글 등록 실패", error);
      alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
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
          onPhotoChange={handlePhotoChange}
          onPhotoRemove={() => {
            setPhoto(null);
            setPhotoPreview(null);
          }}
          setPhotoError={() => {}}
          shakeKeyframes={""}
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
        <GreenInput
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError(false);
          }}
          maxLength={30}
          error={titleError}
          errorMessage="제목을 작성해주세요."
          placeholder="제목을 입력해주세요 (20자 이내)"
          style={{
            marginBottom: "1rem",
            border: titleError ? "2px solid #dc3545" : "2px solid #70a784",
          }}
        />
        <GreenInput
          as="textarea"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setContentError(false);
          }}
          maxLength={300}
          error={contentError}
          errorMessage="글 내용을 작성해주세요."
          placeholder="내용을 입력하세요. (300자 이내)"
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
          style={{ width: "100%", marginTop: "1.5rem" }}
        >
          등록하기
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

export default FreeBoardWriteForm;
