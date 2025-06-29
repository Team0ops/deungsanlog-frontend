import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Pagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import axiosInstance from "shared/lib/axiosInstance";
import FeedCard from "widgets/community/board/FreeCard";
import FreeBoardMyHeader from "widgets/community/board/FreeBoardMyHeader";
import ConfirmModal from "widgets/Modal/ConfirmModal";
import { getUserInfo } from "shared/lib/auth";

const FreeBoardMyPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetPost, setDeleteTargetPost] = useState(null);
  const [sortOption, setSortOption] = useState("latest");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const size = 6;

  // 로그인 정보 가져오기
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.userId) {
      setUserId(userInfo.userId);
    } else {
      setUserId(null);
    }
  }, []);

  // 게시글 수정 핸들러
  const handleEdit = (post) => {
    window.location.href = `/community/free/edit/${post.id}`;
  };

  // 게시글 삭제 핸들러
  const handleDelete = (post) => {
    setDeleteTargetPost(post);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetPost) return;
    try {
      await axiosInstance.delete(
        `/community-service/posts/${deleteTargetPost.id}`
      );
      setPosts((prev) => prev.filter((p) => p.id !== deleteTargetPost.id));
    } catch {
      alert("삭제에 실패했습니다.");
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetPost(null);
    }
  };

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axiosInstance
      .get(`/community-service/posts/user/${userId}`, {
        params: { page, size },
      })
      .then((res) => {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [page, userId]);

  // 프론트에서 정렬
  const getSortedPosts = () => {
    if (!posts) return [];
    let sorted = [...posts];
    if (sortOption === "latest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "oldest") {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === "popular") {
      sorted.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
    }
    return sorted;
  };

  return (
    <div
      style={{
        minWidth: "90%",
        maxWidth: "100%",
        minHeight: "40vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        borderRadius: "20px",
        padding: isMobile
          ? "clamp(0.8rem, 3vw, 1rem) clamp(0.8rem, 3vw, 1rem) clamp(3rem, 8vw, 4rem) clamp(0.8rem, 3vw, 1rem)"
          : "clamp(1rem, 4vw, 1.5rem)",
        position: "relative",
        height: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "1rem" : "1.2rem",
          height: "auto",
          position: "relative",
        }}
      >
        {/* 헤더에 sortOption, setSortOption 전달 */}
        <FreeBoardMyHeader
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        <Box
          sx={{
            width: "100%",
            minHeight: "200px",
            background: "transparent",
            borderRadius: "14px",
            boxShadow: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: posts.length === 0 ? "center" : "flex-start",
            color: "#aaa",
            fontSize: isMobile ? "1rem" : "1.1rem",
            p: isMobile ? 2 : 3,
          }}
        >
          {loading ? (
            <div
              style={{
                color: "#666",
                textAlign: "center",
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontFamily: "'GmarketSansMedium', sans-serif",
                lineHeight: "1.6",
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "2.5rem" : "3rem",
                  animation: "bounce 1.5s infinite",
                }}
              >
                🐿️
              </div>
              <div>
                <div style={{ marginBottom: "0.5rem" }}>
                  내 게시글을 열심히 찾고 있어요!
                </div>
                <div
                  style={{
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    color: "#888",
                  }}
                >
                  잠시만 기다려주세요... 🌰
                </div>
              </div>
              <style>
                {`
                  @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                      transform: translateY(0);
                    }
                    40% {
                      transform: translateY(-10px);
                    }
                    60% {
                      transform: translateY(-5px);
                    }
                  }
                `}
              </style>
            </div>
          ) : getSortedPosts().length === 0 ? (
            <div
              style={{
                color: "#888",
                textAlign: "center",
                marginTop: 0,
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontFamily: "'GmarketSansMedium', sans-serif",
                lineHeight: "1.6",
                minHeight: "220px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              🐿️ 아직 작성한 게시글이 없어요! <br />첫 번째 이야기를 남겨볼까요?
              🌰
            </div>
          ) : (
            getSortedPosts().map((post, idx) => (
              <div
                key={post.id}
                style={{
                  width: "100%",
                  marginBottom:
                    idx !== posts.length - 1
                      ? isMobile
                        ? "1rem"
                        : "1.2rem"
                      : 0,
                }}
              >
                <FeedCard
                  post={post}
                  myUserId={userId}
                  onEdit={() => handleEdit(post)}
                  onDelete={() => handleDelete(post)}
                />
              </div>
            ))
          )}
        </Box>
        {/* 페이지네이션 버튼 */}
        <Box display="flex" justifyContent="center" mt={isMobile ? 1 : 2}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, value) => setPage(value - 1)}
            color="primary"
            shape="rounded"
            size={isMobile ? "medium" : "large"}
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 1}
            showFirstButton={!isMobile}
            showLastButton={!isMobile}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#356849",
                fontWeight: 600,
                borderRadius: "24px !important",
                outline: "none",
                fontSize: isMobile ? "0.9rem" : "1rem",
                minWidth: isMobile ? "32px" : "40px",
                height: isMobile ? "32px" : "40px",
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
      </div>
      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showDeleteModal}
        message={
          "게시글을 삭제하면 복구할 수 없습니다.\n정말 삭제하시겠습니까?"
        }
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteTargetPost(null);
        }}
        onConfirm={confirmDelete}
        cancelText="취소"
        confirmText="삭제"
      />
    </div>
  );
};

export default FreeBoardMyPage;
