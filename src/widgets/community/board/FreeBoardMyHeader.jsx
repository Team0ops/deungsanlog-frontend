import { Box, Typography } from "@mui/material";
import GreenButton from "shared/ui/GreenButton";
import { useNavigate } from "react-router-dom";

const messages = [
  "🌱 오늘도 나만의 이야기를 남겼어요!",
  "🌰 도토리처럼 소중한 글들이 쌓였어요!",
  "🦔 나의 흔적을 따라가 볼까요?",
  "📜 옛날 글 읽다 보면 추억 여행 시작~",
  "🍀 자유게시판의 주인공은 나야 나!",
  "😊 내가 남긴 흔적, 다시 보면 더 특별해요!",
  "📚 내 글 모아보니 작가가 된 기분이에요!",
  "💬 나의 생각, 감정들이 고스란히 담긴 공간!",
  "🍃 마음속 이야기들이 여기에 쏙쏙!",
];

const FreeBoardMyHeader = ({ sortOption, setSortOption }) => {
  const navigate = useNavigate();
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <Box
      width="100%"
      maxWidth="1000px"
      mx="auto"
      mt={4}
      px={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        gap={3}
        bgcolor="#fdfdfd"
        borderRadius={3}
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
        p={3}
        alignItems="stretch"
      >
        {/* 메시지/타이틀 (왼쪽) */}
        <Box
          flex={2}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          px={2}
          py={1}
          textAlign="center"
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            mb={1}
            sx={{
              color: "#2b2b2b",
              letterSpacing: "0.01em",
            }}
          >
            나의 자유게시판 활동
          </Typography>
          <Typography
            variant="h5"
            fontWeight={900}
            mb={2}
            sx={{
              color: "#4b8161",
              background: "linear-gradient(transparent 60%, #fff7c9 60%)",
              borderRadius: 0,
              display: "inline",
              boxDecorationBreak: "clone",
            }}
          >
            {randomMessage}
          </Typography>
        </Box>

        {/* 구분선 */}
        <Box
          width="2px"
          bgcolor="#e0e0e0"
          mx={2}
          borderRadius={1}
          display={{ xs: "none", md: "block" }}
        />

        {/* 버튼/셀렉트 박스 (오른쪽) */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <GreenButton
            onClick={() => navigate("/community/free/write")}
            style={{
              height: "50px",
              width: "90%",
              color: "#4c7559",
              fontWeight: "bold",
              fontSize: "1.1rem",
              background: "#fdfdfd",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            글쓰기
          </GreenButton>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              height: "50px",
              width: "90%",
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
              marginTop: "4px",
            }}
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="popular">인기순</option>
          </select>
        </Box>
      </Box>
    </Box>
  );
};

export default FreeBoardMyHeader;
