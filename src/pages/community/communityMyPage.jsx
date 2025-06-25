import { Box, Typography } from "@mui/material";

const CommunityMyPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "2rem 1rem",
        background: "#f9f9f9",
        borderRadius: "18px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" fontWeight={700} mb={2} color="#356849">
        나의 커뮤니티 활동
      </Typography>
      <Typography variant="body1" color="#666" mb={4}>
        내가 작성한 게시글, 댓글, 좋아요 등 커뮤니티 활동 내역을 한눈에 볼 수
        있습니다.
      </Typography>
      {/* TODO: 내 게시글/댓글/좋아요 등 리스트 컴포넌트 추가 */}
      <Box
        sx={{
          width: "100%",
          minHeight: "200px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 1px 6px rgba(76,117,89,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#aaa",
          fontSize: "1.1rem",
        }}
      >
        준비 중입니다.
      </Box>
    </Box>
  );
};

export default CommunityMyPage;
