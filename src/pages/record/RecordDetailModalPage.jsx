// pages/record/RecordDetailModalPage.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axiosInstance from "shared/lib/axiosInstance";
import defaultImage from "shared/assets/images/logo_mountain.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ConfirmModal from "widgets/Modal/ConfirmModal";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const RecordDetailModalPage = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultModal, setResultModal] = useState({ open: false, message: "" });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    axiosInstance
      .get(`/record-service/record/${recordId}`)
      .then((res) => setRecord(res.data))
      .catch((err) => {
        console.error(err);
        alert("기록을 불러오지 못했습니다.");
        navigate(-1);
      });
  }, [recordId, navigate]);

  const handleClose = () => navigate(-1);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/log/edit/${recordId}`);
  };

  const handleDelete = async () => {
    handleMenuClose();
    setConfirmOpen(false);
    try {
      await axiosInstance.delete(`/record-service/delete?recordId=${recordId}`);
      setResultModal({ open: true, message: "삭제되었습니다." });
    } catch (e) {
      setResultModal({ open: true, message: "삭제에 실패했습니다." });
      console.error(e);
    }
  };

  if (!record) return null;

  return (
    <Dialog
      open
      onClose={handleClose}
      maxWidth={isMobile ? "xs" : "sm"}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? "16px" : "24px",
          m: isMobile ? 1 : 3,
          p: isMobile ? 1 : 3,
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        {/* X 버튼 */}
        <IconButton
          className="record-modal-close-btn"
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: isMobile ? 10 : 20,
            right: isMobile ? 10 : 20,
            zIndex: 10,
            background: "#fff",
            boxShadow: "0 2px 8px 0 rgba(76, 117, 89, 0.12)",
            border: "1.5px solid #e0e0e0",
            width: isMobile ? 32 : 40,
            height: isMobile ? 32 : 40,
            outline: "none",
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
            "&:hover": {
              background: "#f0f8ea",
              boxShadow: "0 4px 16px 0 rgba(76, 117, 89, 0.18)",
              borderColor: "#b6d7b9",
            },
            transition: "all 0.15s",
          }}
        >
          <CloseIcon sx={{ fontSize: isMobile ? 22 : 28, color: "#4b8161" }} />
        </IconButton>
        {/* 메뉴 버튼 */}
        <IconButton
          className="record-modal-menu-btn"
          onClick={handleMenuClick}
          sx={{
            position: "absolute",
            top: isMobile ? 10 : 20,
            right: isMobile ? 50 : 70,
            zIndex: 10,
            background: "#fff",
            boxShadow: "0 2px 8px 0 rgba(76, 117, 89, 0.12)",
            border: "1.5px solid #e0e0e0",
            width: isMobile ? 32 : 40,
            height: isMobile ? 32 : 40,
            outline: "none",
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
            "&:hover": {
              background: "#f0f8ea",
              boxShadow: "0 4px 16px 0 rgba(76, 117, 89, 0.18)",
              borderColor: "#b6d7b9",
            },
            transition: "all 0.15s",
          }}
        >
          <MoreVertIcon
            sx={{ fontSize: isMobile ? 18 : 26, color: "#4b8161" }}
          />
        </IconButton>
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit}>수정</MenuItem>
          <MenuItem onClick={() => setConfirmOpen(true)}>삭제</MenuItem>
        </Menu>
        {/* 버튼 아래에 여백 추가 */}
        <Box sx={{ height: isMobile ? 32 : 48 }} />
        <DialogContent sx={{ p: isMobile ? 1 : 3 }}>
          <Box
            component="img"
            src={
              record.photoUrl
                ? `${baseUrl}/record-service${record.photoUrl}`
                : defaultImage
            }
            alt="등산기록 이미지"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 2,
              mb: 2,
              maxHeight: isMobile ? 220 : 400,
              objectFit: "contain",
              background: "#eee",
              display: "block",
              mx: "auto",
            }}
          />
          {/* 산 아이콘 + 산 이름 */}
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <span
              role="img"
              aria-label="mountain"
              style={{ fontSize: isMobile ? "1.1rem" : "1.3rem" }}
            >
              🏔️
            </span>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              sx={{ fontWeight: 700 }}
            >
              {record.mountainName}
            </Typography>
          </Box>
          {/* 날짜(작성일) 아래로 */}
          <Box
            sx={{
              background: "#f2f7ee",
              borderRadius: "16px",
              p: isMobile ? 1.2 : 2,
              my: isMobile ? 1 : 2,
              minHeight: isMobile ? 40 : 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              gap: 1,
              boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#355c2e",
                fontWeight: 500,
                fontSize: isMobile ? "0.98rem" : "1.05rem",
                textAlign: "left",
                wordBreak: "break-all",
                width: "100%",
              }}
            >
              {record.content}
            </Typography>
            {record.createdAt && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, fontSize: isMobile ? "0.85rem" : undefined }}
              >
                {(() => {
                  const date = new Date(record.createdAt);
                  return `${date.getFullYear()}년 ${
                    date.getMonth() + 1
                  }월 ${date.getDate()}일`;
                })()}
              </Typography>
            )}
          </Box>
        </DialogContent>
        {/* 삭제 확인 모달 */}
        <ConfirmModal
          isOpen={confirmOpen}
          message={"정말 삭제하시겠습니까?"}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
          cancelText="취소"
          confirmText="삭제"
        />
        {/* 결과 안내 모달 */}
        <ConfirmModal
          isOpen={resultModal.open}
          message={resultModal.message}
          onCancel={() => {
            setResultModal({ open: false, message: "" });
            if (resultModal.message === "삭제되었습니다.") navigate(-1);
          }}
          onConfirm={() => {
            setResultModal({ open: false, message: "" });
            if (resultModal.message === "삭제되었습니다.") navigate(-1);
          }}
          cancelText="확인"
          confirmText="확인"
        />
      </Box>
    </Dialog>
  );
};

export default RecordDetailModalPage;
