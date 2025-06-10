import { Box, IconButton } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import GreenButton from "shared/ui/greenButton";

const PhotoUploadWidget = ({
  photoPreview,
  photoError,
  onPhotoChange,
  onPhotoRemove,
  shakeKeyframes,
  setPhotoError,
}) => (
  <>
    <style>{shakeKeyframes}</style>
    <Box
      mt={{ xs: "6vw", md: "15rem" }} // 위쪽 여백 추가
      mb={{ xs: "4vw", md: "2rem" }}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        sx={{
          width: { xs: "60vw", sm: "300px" },
          height: { xs: "60vw", sm: "300px" },
          maxWidth: "300px",
          maxHeight: "300px",
          border: photoError ? "2px dashed #b1403e" : "2px dashed #bdbdbd",
          borderRadius: "12px",
          background: "#f8fff9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          animation: photoError ? "shake 0.6s" : "none",
          transition: "border 0.2s",
        }}
      >
        {photoPreview ? (
          <>
            <img
              src={photoPreview}
              alt="미리보기"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
            <IconButton
              size="small"
              onClick={onPhotoRemove}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(255,255,255,0.8)",
                "&:hover": { background: "rgba(255,255,255,1)" },
                zIndex: 2,
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <span
            style={{
              color: photoError ? "#b1403e" : "#bdbdbd",
              fontWeight: 500,
              textAlign: "center",
              fontSize: "1rem",
              transition: "color 0.2s",
            }}
          >
            사진 1장은
            <br />
            필수로 첨부해야합니다 :)
          </span>
        )}
      </Box>
      {/* 버튼과 사진 박스 사이 간격 추가 */}
      <Box height={{ xs: "4vw", md: "1.2rem" }} />
      <GreenButton
        component="label"
        style={{
          background: "#70a784",
          color: "#ffffff",
          width: "min(90vw, 160px)",
          height: "2.7rem",
          borderRadius: "12px",
          fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", // 반응형 폰트 크기
          textAlign: "center",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
        }}
        onClick={() => setPhotoError(false)}
      >
        사진 선택
        <input type="file" accept="image/*" hidden onChange={onPhotoChange} />
      </GreenButton>
    </Box>
  </>
);

export default PhotoUploadWidget;
