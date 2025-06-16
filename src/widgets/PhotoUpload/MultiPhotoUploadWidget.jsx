import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GreenButton from "shared/ui/greenButton";

const MultiPhotoUploadWidget = ({
  photos = [],
  photoPreviews,
  photoError,
  onPhotosChange,
  onPhotoRemove,
  shakeKeyframes,
  setPhotoError,
  max = 3,
}) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // 반드시 File 객체만 누적
    const newFiles = [...photos, ...files].slice(0, max);
    onPhotosChange(newFiles);
    setPhotoError(false);
    e.target.value = ""; // 같은 파일 연속 첨부 방지
  };

  return (
    <>
      <style>{shakeKeyframes}</style>
      <Box
        mt={{ xs: "6vw", md: "15rem" }}
        mb={{ xs: "4vw", md: "2rem" }}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box
          sx={{
            display: "flex",
            gap: "0.8rem",
            flexWrap: "wrap",
            justifyContent: "center",
            animation: photoError ? "shake 0.6s" : "none",
          }}
        >
          {[...Array(max)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: { xs: "45vw", sm: "170px" },
                height: { xs: "45vw", sm: "170px" },
                border:
                  photoError && photoPreviews.length === 0
                    ? "2px solid #dc3545"
                    : "2px dashed #bdbdbd",
                borderRadius: "12px",
                background: "#f8fff9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {photoPreviews[i] && (
                <>
                  <img
                    src={photoPreviews[i]}
                    alt={`미리보기 ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => onPhotoRemove(i)}
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      background: "rgba(255,255,255,0.8)",
                      "&:hover": { background: "rgba(255,255,255,1)" },
                      zIndex: 2,
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          ))}
        </Box>

        {/* ✅ 안내 문구를 여기에 위치시킴 */}
        <Box mt="1.6rem" mb="0rem">
          <span
            style={{
              color: "#828a84",
              fontWeight: 500,
              fontSize: "0.92rem",
              textAlign: "center",
              display: "block",
            }}
          >
            사진은 최대 {max}장까지 첨부 가능합니다 :)
          </span>
        </Box>

        <Box height={{ xs: "4vw", md: "1.2rem" }} />
        <GreenButton
          component="label"
          style={{
            background: "#70a784",
            color: "#ffffff",
            width: "min(90vw, 160px)",
            height: "2.7rem",
            borderRadius: "12px",
            fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
            textAlign: "center",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            opacity: photoPreviews.length >= max ? 0.5 : 1,
            cursor: photoPreviews.length >= max ? "not-allowed" : "pointer",
          }}
        >
          사진 선택
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
            multiple
            disabled={photoPreviews.length >= max}
          />
        </GreenButton>
      </Box>
    </>
  );
};

export default MultiPhotoUploadWidget;
