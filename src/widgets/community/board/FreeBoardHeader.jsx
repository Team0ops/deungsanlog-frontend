import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import GreenButton from "shared/ui/GreenButton";

const messages = [
  "오늘은 어떤 이야기를 나눠볼까요?",
  "등산 후기도 좋고, 아무 이야기나 환영이에요!",
  "커뮤니티에서 함께 소통해요 😊",
];

const FreeBoardHeader = ({ sortOption, setSortOption }) => {
  const navigate = useNavigate();
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="stretch"
      gap={3}
      width="100%"
      maxWidth="1000px"
      mx="auto"
      mt={4}
      px={2}
    >
      {/* 좌측 메시지 박스 */}
      <Box
        flex={1}
        textAlign="center"
        px={2}
        py={3}
        borderRadius={3}
        bgcolor="#fdfdfd"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
        height="100%"
      >
        <Typography
          variant="h5"
          fontWeight={600}
          mb={2}
          sx={{
            color: "#2e2e2e",
            background: "linear-gradient(transparent 60%, #d4f1db 60%)",
            borderRadius: 0,
            display: "inline",
            boxDecorationBreak: "clone",
          }}
        >
          {randomMessage}
        </Typography>
        <Typography variant="body1" mt={1}>
          당신의 글이 다른 사람에게 힘이 될 수 있어요 ✨
        </Typography>
      </Box>

      {/* 우측 버튼 + 셀렉트박스 */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={1}
        width="20%"
        height="100%"
        p={2}
      >
        <GreenButton
          onClick={() => navigate("/community/free/write")}
          style={{
            height: "65px",
            width: "100%",
            color: "#4c7559",
            background: "#fdfdfd",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          ✏️ 글쓰기
        </GreenButton>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            height: "65px",
            width: "100%",
            padding: "0 1rem",
            borderRadius: "12px",
            border: "1px solid #d0d0d0",
            background: "#fdfdfd",
            fontWeight: "bold",
            fontSize: "1rem",
            color: "#4c7559",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg fill='Green' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
            backgroundSize: "16px 16px",
          }}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="likes">좋아요순</option>
        </select>
      </Box>
    </Box>
  );
};

export default FreeBoardHeader;
