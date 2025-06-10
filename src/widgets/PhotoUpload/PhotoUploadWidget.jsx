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
    <Box mb={2} display="flex" justifyContent="center">
      <Box
        sx={{
          width: 250,
          height: 250,
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
    </Box>
    <GreenButton
      component="label"
      style={{
        width: "100%",
        margin: "16px 0",
        fontSize: "1.1rem",
        padding: "1rem 0",
      }}
      onClick={() => setPhotoError(false)}
    >
      사진 업로드
      <input type="file" accept="image/*" hidden onChange={onPhotoChange} />
    </GreenButton>
  </>
);

export default PhotoUploadWidget;
