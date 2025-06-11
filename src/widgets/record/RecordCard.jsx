import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import defaultImage from "shared/assets/images/logo_mountain.png";
import axios from "axios";

const RecordCard = ({
  image,
  mountainName,
  date,
  content,
  onEdit,
  recordId,
  onDeleted, // 삭제 후 콜백 prop 추가 (optional)
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      console.log("삭제 요청 recordId:", recordId); // 추가
      await axios.delete(
        `http://localhost:8080/record-service/delete?recordId=${recordId}`
      );
      alert("삭제되었습니다.");
      if (onDeleted) onDeleted();
    } catch (e) {
      alert("삭제에 실패했습니다.");
      console.error(e); // 에러 로그 확인
    }
  };

  return (
    <Box
      sx={{
        width: 250,
        height: 330,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        bgcolor: "#f8f8f8",
        mb: 4,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      {/* 이미지 영역 */}
      <Box sx={{ position: "relative", width: "100%", height: 170 }}>
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
            minHeight: 170,
            maxHeight: 170,
            minWidth: 250,
            maxWidth: 250,
            objectFit: "cover",
            display: "block",
          }}
        />
        {/* 아이콘 버튼 (이미지 오른쪽 위) */}
        <IconButton
          onClick={handleClick}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(255,255,255,0.7)",
            zIndex: 2,
          }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              handleClose();
              onEdit?.();
            }}
          >
            수정
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              handleDelete(); // 삭제 함수 연동
            }}
          >
            삭제
          </MenuItem>
        </Menu>
      </Box>
      {/* 날짜 영역 */}
      <Box px={2} pt={1}>
        <Typography variant="caption" color="gray" noWrap>
          {date}
        </Typography>
      </Box>
      {/* 글 영역 */}
      <Box
        px={2}
        pb={2}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          fontWeight="bold"
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
            display: "block",
          }}
        >
          {mountainName}
        </Typography>
        <Typography
          mt={1}
          sx={{
            fontSize: "0.9rem",
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
    </Box>
  );
};

export default RecordCard;
