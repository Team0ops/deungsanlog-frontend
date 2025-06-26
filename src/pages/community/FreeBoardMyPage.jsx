import { useEffect, useState } from "react";
import { Box, Typography, Pagination } from "@mui/material";
import axiosInstance from "shared/lib/axiosInstance";
import FeedCard from "widgets/community/board/FreeCard";
import FreeBoardMyHeader from "widgets/community/board/FreeBoardMyHeader";
import ConfirmModal from "widgets/Modal/ConfirmModal";

const FreeBoardMyPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [userId] = useState(11); // userId 하드코딩
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetPost, setDeleteTargetPost] = useState(null);

  const size = 6;

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
        padding: "clamp(1rem, 4vw, 1.5rem)",
        position: "relative",
        height: "calc(100vh - 40px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
          height: "100%",
          position: "relative",
        }}
      >
        {/* 헤더 추가 */}
        <FreeBoardMyHeader />
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
            fontSize: "1.1rem",
            p: 3,
            overflowY: "auto",
            maxHeight: "calc(100vh - 180px)",
          }}
        >
          {loading
            ? "불러오는 중..."
            : posts.length === 0
            ? "작성한 게시글이 없습니다."
            : posts.map((post, idx) => (
                <div
                  key={post.id}
                  style={{
                    width: "100%",
                    marginBottom: idx !== posts.length - 1 ? "1.2rem" : 0,
                  }}
                >
                  <FeedCard
                    post={post}
                    myUserId={userId}
                    onEdit={() => handleEdit(post)}
                    onDelete={() => handleDelete(post)}
                  />
                </div>
              ))}
        </Box>
        {/* 페이지네이션 버튼 */}
        <Box display="flex" justifyContent="center" mt={2}>
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
