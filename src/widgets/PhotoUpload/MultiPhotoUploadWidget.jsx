import { Box, IconButton, useTheme, useMediaQuery } from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
        mt={{ xs: "4vw", md: "15rem" }}
        mb={{ xs: "3vw", md: "2rem" }}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box
          sx={{
            display: "flex",
            gap: isMobile ? "0.4rem" : "0.8rem",
            flexWrap: "wrap",
            justifyContent: "center",
            animation: photoError ? "shake 0.6s" : "none",
            width: "100%",
            maxWidth: isMobile ? "100%" : "auto",
          }}
        >
          {[...Array(max)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: isMobile
                  ? "calc(33.33% - 0.27rem)"
                  : { xs: "42vw", sm: "170px" },
                height: isMobile
                  ? "calc(33.33vw - 0.27rem)"
                  : { xs: "42vw", sm: "170px" },
                maxWidth: isMobile ? "120px" : "none",
                maxHeight: isMobile ? "120px" : "none",
                border:
                  photoError && photoPreviews.length === 0
                    ? "2px solid #dc3545"
                    : "2px dashed #bdbdbd",
                borderRadius: isMobile ? "8px" : "12px",
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
                      borderRadius: isMobile ? "8px" : "12px",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => onPhotoRemove(i)}
                    sx={{
                      position: "absolute",
                      top: isMobile ? 2 : 6,
                      right: isMobile ? 2 : 6,
                      background: "rgba(255,255,255,0.9)",
                      "&:hover": { background: "rgba(255,255,255,1)" },
                      zIndex: 2,
                      width: isMobile ? "20px" : "auto",
                      height: isMobile ? "20px" : "auto",
                      minWidth: "auto",
                      minHeight: "auto",
                    }}
                  >
                    <CloseIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </>
              )}
            </Box>
          ))}
        </Box>

        {/* ✅ 안내 문구를 여기에 위치시킴 */}
        <Box mt={isMobile ? "1.2rem" : "1.6rem"} mb="0rem">
          <span
            style={{
              color: "#828a84",
              fontWeight: 500,
              fontSize: isMobile ? "0.85rem" : "0.92rem",
              textAlign: "center",
              display: "block",
            }}
          >
            사진은 최대 {max}장까지 첨부 가능합니다 :)
          </span>
        </Box>

        <Box height={{ xs: "3vw", md: "1.2rem" }} />
        <GreenButton
          component="label"
          style={{
            background: "#70a784",
            color: "#ffffff",
            width: isMobile ? "min(85vw, 140px)" : "min(90vw, 160px)",
            height: isMobile ? "2.4rem" : "2.7rem",
            borderRadius: isMobile ? "8px" : "12px",
            fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 2.5vw, 1.1rem)",
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
