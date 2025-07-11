import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import GreenButton from "shared/ui/greenButton";
import GreenInput from "shared/ui/greenInput";
import MultiPhotoUploadWidget from "widgets/PhotoUpload/MultiPhotoUploadWidget";
import LogMountainSearchModal from "pages/record/LogMountainSearchModal";
import MountainSearchOnlyWidget from "widgets/mountain/MountainSearchOnlyWidget";
import ConfirmModal from "widgets/Modal/ConfirmModal";
import axiosInstance from "shared/lib/axiosInstance";

const FreeBoardWriteForm = ({ userId: propUserId }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { postId } = useParams();
  const userId = propUserId;
  const [title, setTitle] = useState("");
  const [mountain, setMountain] = useState(null);
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [mountainError, setMountainError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [mountainModalOpen, setMountainModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(
          `/community-service/posts/${postId}`
        );
        const data = res.data;
        setTitle(data.title);
        setContent(data.content);

        // 산 정보 처리
        if (data.mountainId && data.mountainName) {
          setMountain({
            id: data.mountainId,
            name: data.mountainName,
            location: "",
          });
        } else if (data.mountainId) {
          // mountainName이 없으면 fetch
          const res2 = await axiosInstance.get(
            `/mountain-service/name-by-id?mountainId=${data.mountainId}`
          );
          setMountain({
            id: data.mountainId,
            name: res2.data.name,
            location: "",
          });
        } else {
          setMountain(null);
        }

        // 사진 미리보기 처리
        setPhotoPreviews(
          (data.imageUrls || []).map((url) =>
            url.startsWith("http") ? url : `${baseUrl}${url}`
          )
        );
      } catch (err) {
        console.error("게시글 불러오기 실패", err);
        alert("게시글을 불러오지 못했습니다.");
      }
    };
    fetchPost();
  }, [postId]);

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

  const handlePhotoRemove = (idx) => {
    const newPhotos = photos.filter((_, i) => i !== idx);
    const newPreviews = photoPreviews.filter((_, i) => i !== idx);
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    if (!content.trim()) {
      setContentError(true);
      isValid = false;
    }
    if (!title.trim()) {
      setTitleError(true);
      isValid = false;
    }
    if (!isValid) return;

    // 확인 모달 표시
    setConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      let imageUrls = photoPreviews;
      if (photos.length > 0) {
        const formData = new FormData();
        photos.forEach((file) => formData.append("images", file));
        const res = await axiosInstance.post(
          "/community-service/posts/upload-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        imageUrls = res.data;
      }
      const payload = {
        userId,
        type: 0,
        mountainId: mountain?.id || null,
        title,
        content,
        imageUrls,
      };
      if (postId) {
        await axiosInstance.put(`/community-service/posts/${postId}`, payload);
        alert("게시글이 수정되었습니다.");
      } else {
        await axiosInstance.post("/community-service/posts", payload);
        alert("게시글이 등록되었습니다.");
      }
      navigate("/community/free");
    } catch (error) {
      console.error("실패", error);
      alert("처리에 실패했습니다.");
    } finally {
      setConfirmModalOpen(false);
    }
  };

  return (
    <>
      <Box
        maxWidth="100vw"
        width="100%"
        p={{ xs: "0.8rem", md: "2rem" }}
        boxShadow={2}
        borderRadius={3}
        bgcolor="#ffffff"
        sx={{
          maxWidth: { xs: "100vw", md: "700px" },
          minHeight: isMobile ? "50vh" : "60vh",
          maxHeight: isMobile ? "85vh" : "90vh",
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

          {/* 산 검색 위젯 추가 */}
          <MountainSearchOnlyWidget
            value={mountain}
            onChange={setMountain}
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
              marginBottom: isMobile ? "0.8rem" : "1rem",
              border: titleError ? "2px solid #dc3545" : "2px solid #70a784",
              fontSize: isMobile ? "0.95rem" : "1rem",
              height: isMobile ? "44px" : "auto",
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
              marginBottom: isMobile ? "1.2rem" : "1.5rem",
              background: "#f8fff9",
              resize: "vertical",
              fontSize: isMobile ? "0.95rem" : "1rem",
              minHeight: isMobile ? "120px" : "150px",
            }}
          />
          <GreenButton
            type="submit"
            style={{
              width: "100%",
              marginTop: isMobile ? "1.2rem" : "1.5rem",
              height: isMobile ? "48px" : "auto",
              fontSize: isMobile ? "1rem" : "1.05rem",
            }}
          >
            {postId ? "수정하기" : "등록하기"}
          </GreenButton>
          <GreenButton
            type="button"
            style={{
              background: "#72927f",
              color: "#ffffff",
              width: "100%",
              fontSize: isMobile ? "1rem" : "1.05rem",
              padding: isMobile ? "0.7rem 0" : "0.8rem 0",
              marginTop: isMobile ? "0.6rem" : "0.7rem",
              height: isMobile ? "44px" : "auto",
            }}
            onClick={() => navigate(-1)}
          >
            뒤로가기
          </GreenButton>
        </form>
      </Box>

      <ConfirmModal
        isOpen={confirmModalOpen}
        message={
          postId ? "게시글을 수정하시겠습니까?" : "게시글을 등록하시겠습니까?"
        }
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        cancelText="취소"
        confirmText={postId ? "수정" : "등록"}
      />
    </>
  );
};

export default FreeBoardWriteForm;
