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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axiosInstance from "shared/lib/axiosInstance";
import defaultImage from "shared/assets/images/logo_mountain.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import html2canvas from "html2canvas"; // 이미지 저장용

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const RecordDetailModalPage = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

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
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axiosInstance.delete(`/record-service/delete?recordId=${recordId}`);
      alert("삭제되었습니다.");
      navigate(-1);
    } catch (e) {
      alert("삭제에 실패했습니다.");
      console.error(e);
    }
  };

  const handleImageDownload = async () => {
    handleMenuClose();
    // X, 메뉴 버튼 숨기기
    const closeBtn = document.querySelector(".record-modal-close-btn");
    const menuBtn = document.querySelector(".record-modal-menu-btn");
    if (closeBtn) closeBtn.style.visibility = "hidden";
    if (menuBtn) menuBtn.style.visibility = "hidden";

    const modal = document.querySelector(".MuiDialog-paper");
    if (!modal) return;
    try {
      const canvas = await html2canvas(modal, { useCORS: true, scale: 2 });
      const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
      const link = document.createElement("a");
      const now = new Date().toISOString().split("T")[0];
      link.href = dataUrl;
      link.download = `Deungsanlog_${now}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("이미지 저장 실패", err);
      alert("이미지 저장에 실패했습니다.");
    } finally {
      // 다시 버튼 보이게
      if (closeBtn) closeBtn.style.visibility = "visible";
      if (menuBtn) menuBtn.style.visibility = "visible";
    }
  };

  if (!record) return null;

  return (
    <Dialog
      open
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "24px" },
      }}
    >
      <Box sx={{ position: "relative" }}>
        {/* X 버튼 */}
        <IconButton
          className="record-modal-close-btn"
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 10,
            background: "#fff",
            boxShadow: "0 2px 8px 0 rgba(76, 117, 89, 0.12)",
            border: "1.5px solid #e0e0e0",
            width: 40,
            height: 40,
            outline: "none", // 추가
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
          <CloseIcon sx={{ fontSize: 28, color: "#4b8161" }} />
        </IconButton>
        {/* 메뉴 버튼 */}
        <IconButton
          className="record-modal-menu-btn"
          onClick={handleMenuClick}
          sx={{
            position: "absolute",
            top: 20,
            right: 70,
            zIndex: 10,
            background: "#fff",
            boxShadow: "0 2px 8px 0 rgba(76, 117, 89, 0.12)",
            border: "1.5px solid #e0e0e0",
            width: 40,
            height: 40,
            outline: "none", // 추가
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
          <MoreVertIcon sx={{ fontSize: 26, color: "#4b8161" }} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit}>수정</MenuItem>
          <MenuItem onClick={handleDelete}>삭제</MenuItem>
          <MenuItem onClick={handleImageDownload}>이미지 저장</MenuItem>
        </Menu>
        {/* 버튼 아래에 여백 추가 */}
        <Box sx={{ height: 48 }} />
        <DialogContent>
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
              maxHeight: 400,
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
              style={{ fontSize: "1.3rem" }}
            >
              🏔️
            </span>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {record.mountainName}
            </Typography>
          </Box>
          {/* 날짜(작성일) 아래로 */}
          <Box
            sx={{
              background: "#f2f7ee",
              borderRadius: "16px",
              p: 2,
              my: 2,
              minHeight: 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              gap: 1,
              boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.2)", // 연한 초록 그림자 추가
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#355c2e",
                fontWeight: 500,
                fontSize: "1.05rem",
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
                sx={{ mt: 1 }}
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
      </Box>
    </Dialog>
  );
};

export default RecordDetailModalPage;
