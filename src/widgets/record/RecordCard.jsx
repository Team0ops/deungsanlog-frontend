import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import defaultImage from "shared/assets/images/logo_mountain.png";
import axiosInstance from "shared/lib/axiosInstance";
import html2canvas from "html2canvas";
import ConfirmModal from "../Modal/ConfirmModal";

const RecordCard = ({
  image,
  mountainName,
  date,
  content,
  onEdit,
  onClick,
  recordId,
  onDeleted, // 삭제 후 콜백 prop 추가 (optional)
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // 삭제 모달 상태
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultModal, setResultModal] = useState({ open: false, message: "" });

  const handleDelete = async () => {
    setConfirmOpen(false);
    try {
      await axiosInstance.delete(`/record-service/delete?recordId=${recordId}`);
      setResultModal({ open: true, message: "삭제되었습니다." });
      if (onDeleted) onDeleted();
    } catch (e) {
      setResultModal({ open: true, message: "삭제에 실패했습니다." });
      console.error(e);
    }
  };

  const handleImageDownload = async () => {
    const cardElement = document.getElementById(`record-card-${recordId}`);
    const menuButton = document.getElementById(`menu-button-${recordId}`);
    if (!cardElement) return;

    // 1. 메뉴 버튼 잠깐 숨기기
    if (menuButton) menuButton.style.display = "none";

    try {
      const canvas = await html2canvas(cardElement, {
        useCORS: true,
        scale: 2,
      });

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
      setResultModal({ open: true, message: "이미지 저장에 실패했습니다." });
    } finally {
      // 2. 캡처 후 다시 보이게 하기
      if (menuButton) menuButton.style.display = "block";
    }
  };

  return (
    <>
      <Box
        id={`record-card-${recordId}`}
        onClick={onClick}
        sx={{
          width: 250,
          minHeight: 330,
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "#f8f8f8",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          mb: 4,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          p: 2,
          transition: "box-shadow 0.2s, transform 0.2s, background 0.2s",
          cursor: "pointer",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(28, 48, 34, 0.2)",
            background: "#f3f3f3",
            transform: "translateY(-4px) scale(1.02)",
          },
        }}
      >
        {/* 이미지 영역 */}
        <Box sx={{ position: "relative", width: "100%", height: 200 }}>
          {/* 이미지 높이 고정 */}
          <Box
            component="img"
            src={image}
            alt="record-thumbnail"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              borderRadius: 2,
              background: "#eee",
            }}
          />
          {/* 아이콘 버튼 (이미지 오른쪽 위) */}
          <IconButton
            id={`menu-button-${recordId}`}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e);
            }}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(255,255,255,0.7)",
              zIndex: 2,
              outline: "none",
              boxShadow: "none",
              "&:focus": {
                outline: "none",
                boxShadow: "none",
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
                onEdit?.();
              }}
            >
              수정
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
                setConfirmOpen(true);
              }}
            >
              삭제
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
                handleImageDownload?.();
              }}
            >
              이미지 저장
            </MenuItem>
          </Menu>
        </Box>
        {/* 글 영역 */}
        <Box
          pt={2}
          pb={1}
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {/* 마운틴 네임을 content 위에 배치 */}
          <Box
            sx={{
              display: "block",
            }}
          >
            <Typography
              fontSize="0.9rem"
              fontWeight="bold"
              sx={{
                display: "inline",
                color: "#000",
                background: "#acd8b35e",
                borderRadius: "10px",
                padding: "0 2px",
              }}
            >
              {mountainName}
            </Typography>
          </Box>

          <Typography
            fontSize="0.8rem"
            fontWeight="semibold"
            mt={1}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              whiteSpace: "normal",
              height: "2.8em",
            }}
          >
            {content}
          </Typography>
        </Box>
        {/* 날짜 영역 - 오른쪽 아래 */}
        <Box
          px={2}
          pb={2}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Typography
            variant="caption"
            color="gray"
            noWrap
            fontSize="0.8rem"
            fontWeight="semibold"
          >
            {date}
          </Typography>
        </Box>
      </Box>
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
        onCancel={() => setResultModal({ open: false, message: "" })}
        onConfirm={() => setResultModal({ open: false, message: "" })}
        cancelText="확인"
        confirmText="확인"
      />
    </>
  );
};

export default RecordCard;
