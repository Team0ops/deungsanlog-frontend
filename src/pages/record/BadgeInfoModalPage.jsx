import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "shared/lib/axiosInstance";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BADGE_LEVELS = [
  { level: 1, title: "등산 새싹", requirement: "첫 등산 기록" },
  { level: 2, title: "초보 등산러", requirement: "5회 등산 기록" },
  { level: 3, title: "슬슬 탄력받는 중", requirement: "10회 등산 기록" },
  { level: 4, title: "꾸준한 도전자", requirement: "20회 등산 기록" },
  { level: 5, title: "열정 등산가", requirement: "30회 등산 기록" },
  { level: 6, title: "산길 개척자", requirement: "50회 등산 기록" },
  { level: 7, title: "마스터 등산러", requirement: "70회 등산 기록" },
  { level: 8, title: "정복자", requirement: "100회 등산 기록" },
  { level: 9, title: "전설의 산꾼", requirement: "150회 등산 기록" },
];

const BadgeInfoModalPage = () => {
  const navigate = useNavigate();
  const [badgeInfo, setBadgeInfo] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    axiosInstance
      .get(`/record-service/users/${userId}/badge-profile`)
      .then((res) => setBadgeInfo(res.data))
      .catch(() => setBadgeInfo(null));
  }, []);

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Dialog
      open
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "1.5rem",
          overflow: "visible", // 스크롤 정상 동작
        },
      }}
    >
      <Box
        sx={{
          background: "#fff",
          borderRadius: "1.5rem",
          boxShadow: "0 0.25rem 1rem rgba(0,0,0,0.15)",
          p: 3,
          position: "relative",
          maxHeight: "80vh", // 모달 높이 제한
          overflowY: "auto", // 스크롤 가능
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "#4b8161",
          }}
          aria-label="닫기"
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#4b8161",
            textAlign: "center",
            pb: 1,
          }}
        >
          배지 레벨 안내
        </DialogTitle>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 0, mb: 2 }}
        >
          {" "}
          등산 기록 횟수에 따라
          <br />
          배지가 레벨업됩니다!
        </Typography>

        <DialogContent>
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              mb: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {BADGE_LEVELS.map(({ level, title, requirement }) => {
              const isCurrent = badgeInfo?.stage === level;
              return (
                <Box
                  key={level}
                  component="li"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: 1,
                    borderRadius: "8px",
                    backgroundColor: isCurrent ? "#f4fff1" : "transparent",
                    border: isCurrent ? "2px solid #4b8161" : "1px solid #eee",
                  }}
                >
                  <img
                    src={`/assets/badges/Badge_0${level}.svg`}
                    alt={`레벨 ${level} 배지`}
                    style={{ width: 30, height: 30, flexShrink: 0 }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isCurrent ? 700 : 400,
                        color: isCurrent ? "#4b8161" : "inherit",
                      }}
                    >
                      Lv.{level} - {title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {requirement}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default BadgeInfoModalPage;
