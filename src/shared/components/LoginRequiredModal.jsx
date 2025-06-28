import React from "react";
import { Box, Typography, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

const LoginRequiredModal = ({
  isOpen,
  onClose,
  onLogin,
  title = "로그인이 필요한 서비스입니다",
  message = "해당 기능은 로그인 후에만 이용할 수 있어요!",
}) => {
  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "clamp(1.5rem, 4vw, 2.5rem)",
          maxWidth: "clamp(20rem, 90vw, 28rem)",
          width: "clamp(18rem, 85vw, 25rem)",
          textAlign: "center",
          boxShadow: "0 0.5rem 2rem rgba(0, 0, 0, 0.15)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 아이콘 */}
        <Box
          sx={{
            width: "clamp(3rem, 8vw, 4rem)",
            height: "clamp(3rem, 8vw, 4rem)",
            backgroundColor: "#f8f9fa",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            color: "#6c757d",
          }}
        >
          <LoginIcon sx={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }} />
        </Box>

        {/* 제목 */}
        <Typography
          variant="h6"
          sx={{
            fontSize: "clamp(1.1rem, 3vw, 1.3rem)",
            fontWeight: "600",
            color: "#2c3e50",
            marginBottom: "0.8rem",
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        {/* 메시지 */}
        <Typography
          variant="body1"
          sx={{
            fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
            color: "#6c757d",
            marginBottom: "clamp(1.5rem, 4vw, 2rem)",
            lineHeight: 1.5,
          }}
        >
          {message}
        </Typography>

        {/* 버튼들 */}
        <Box
          sx={{
            display: "flex",
            gap: "0.8rem",
            justifyContent: "center",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {/* 로그인 버튼 */}
          <Button
            variant="contained"
            onClick={onLogin}
            startIcon={<LoginIcon />}
            sx={{
              backgroundColor: "#4285f4",
              color: "white",
              padding: "clamp(0.6rem, 2vw, 0.8rem) clamp(1.2rem, 3vw, 1.5rem)",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
              fontWeight: "500",
              borderRadius: "8px",
              textTransform: "none",
              minWidth: "clamp(8rem, 25vw, 10rem)",
              "&:hover": {
                backgroundColor: "#3367d6",
              },
            }}
          >
            로그인 하러가기
          </Button>

          {/* 취소 버튼 */}
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: "#dee2e6",
              color: "#6c757d",
              padding: "clamp(0.6rem, 2vw, 0.8rem) clamp(1.2rem, 3vw, 1.5rem)",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
              fontWeight: "500",
              borderRadius: "8px",
              textTransform: "none",
              minWidth: "clamp(8rem, 25vw, 10rem)",
              "&:hover": {
                borderColor: "#adb5bd",
                backgroundColor: "#f8f9fa",
              },
            }}
          >
            취소
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginRequiredModal;
