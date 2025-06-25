import { useEffect, useState } from "react";
import { Box, Typography, Pagination } from "@mui/material";
import axiosInstance from "shared/lib/axiosInstance";
import FeedCard from "widgets/community/board/FreeCard";

const CommunityMyPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // userId 하드코딩 (임시)
  const userId = 11;
  const size = 4;

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/community-service/posts/user/${userId}`, {
        params: { page, size },
      })
      .then((res) => {
        setPosts(res.data.posts); // posts 배열로 변경
        setTotalPages(res.data.totalPages); // totalPages 반영
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [page]);

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
      <Box
        sx={{
          width: "100%",
          minHeight: "200px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 1px 6px rgba(76,117,89,0.07)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: posts.length === 0 ? "center" : "flex-start",
          color: "#aaa",
          fontSize: "1.1rem",
          p: 2,
          gap: 2,
        }}
      >
        {loading
          ? "불러오는 중..."
          : posts.length === 0
          ? "작성한 게시글이 없습니다."
          : posts.map((post) => (
              <FeedCard key={post.id} post={post} myUserId={userId} />
            ))}
      </Box>
      {/* 페이지네이션 버튼 */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(_, value) => setPage(value - 1)}
          color="primary"
          shape="rounded"
          size="large"
          siblingCount={1}
          boundaryCount={1}
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#356849",
              fontWeight: 600,
              borderRadius: "24px !important",
              outline: "none",
            },
            "& .Mui-selected": {
              backgroundColor: "#bfccb185 !important",
              color: "#143622 !important",
              border: "none",
              borderRadius: "24px !important",
              outline: "none",
            },
            "& .MuiPaginationItem-root:hover": {
              backgroundColor: "#b5b9ae1c",
              borderRadius: "24px !important",
              outline: "none",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default CommunityMyPage;
