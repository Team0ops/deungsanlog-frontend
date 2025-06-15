import { useState } from "react";
import { Box } from "@mui/material";
import GreenButton from "shared/ui/greenButton";
import GreenInput from "shared/ui/greenInput";
import MountainInputWidget from "widgets/mountain/MountainInputWidget";
import MultiPhotoUploadWidget from "widgets/PhotoUpload/MultiPhotoUploadWidget";
import LogMountainSearchModal from "pages/record/LogMountainSearchModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FreeBoardWriteForm = () => {
  const [title, setTitle] = useState("");
  const [mountain, setMountain] = useState(null);
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState([]); // 여러 장 파일
  const [photoPreviews, setPhotoPreviews] = useState([]); // 여러 장 미리보기
  const [mountainError, setMountainError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [mountainModalOpen, setMountainModalOpen] = useState(false);
  const navigate = useNavigate();

  // 여러 장 파일 선택 핸들러
  const handlePhotosChange = (newFiles) => {
    setPhotos(newFiles);
    const readers = newFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then(setPhotoPreviews);
  };

  // 개별 사진 삭제
  const handlePhotoRemove = (idx) => {
    const newPhotos = photos.filter((_, i) => i !== idx);
    const newPreviews = photoPreviews.filter((_, i) => i !== idx);
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    // 사진 필수 검사 제거
    // if (!photos || photos.length === 0) {
    //   setPhotoError(true);
    //   isValid = false;
    // }

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
      // 사진이 있을 때만 업로드
      let imageUrls = [];
      if (photos && photos.length > 0) {
        const formData = new FormData();
        photos.forEach((file) => formData.append("images", file));
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
        <MultiPhotoUploadWidget
          photos={photos}
          photoPreviews={photoPreviews}
          photoError={false}
          onPhotosChange={handlePhotosChange}
          onPhotoRemove={handlePhotoRemove}
          setPhotoError={() => {}}
          shakeKeyframes={""}
          max={3}
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
          onPhotoRemove={() => {
            setPhotos([]);
            setPhotoPreviews([]);
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
