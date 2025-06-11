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
        minHeight: 330,
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
      <Box sx={{ position: "relative", width: "100%", height: 200 }}>
        {" "}
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
            objectFit: "cover", // 이미지를 영역에 맞게 채움
            display: "block",
            borderRadius: 2,
            background: "#eee",
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
            display: "block", // flex 안에서 강제로 inline context로
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
  );
};

export default RecordCard;
