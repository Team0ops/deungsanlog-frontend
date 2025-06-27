import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import FeedCard from "widgets/community/board/FreeCard";
import FreeBoardHeader from "widgets/community/board/FreeBoardHeader";
import FreeBoardSearchSection from "widgets/community/board/FreeBoardSearchSection";
import { getUserInfo } from "shared/lib/auth";
import axiosInstance from "shared/lib/axiosInstance";
import { Pagination } from "@mui/material";
import ConfirmModal from "widgets/Modal/ConfirmModal";

const PAGE_SIZE = 6;

const FreeBoardPage = () => {
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("latest");
  const [searchField, setSearchField] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetPost, setDeleteTargetPost] = useState(null);
  const navigate = useNavigate();
  const cardAreaRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
    navigate(`/community/free/edit/${post.id}`);
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

  // 게시글 검색 핸들러
  const handleSearch = async ({
    sort = sortOption,
    field = searchField,
    keyword = searchKeyword,
    page = 0,
    size = PAGE_SIZE,
  } = {}) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/community-service/posts/search", {
        params: { sort, field, keyword, page, size },
      });
      setPosts(Array.isArray(res.data?.posts) ? res.data.posts : []);
      setTotalPages(
        typeof res.data?.totalPages === "number" ? res.data.totalPages : 0
      );
    } catch {
      setPosts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // 게시글 최초 로딩
  useEffect(() => {
    handleSearch({
      sort: sortOption,
      field: searchField,
      keyword: searchKeyword,
      page: 0,
      size: PAGE_SIZE,
    });
    // eslint-disable-next-line
  }, []);

  // 1. 정렬/검색 조건이 바뀔 때마다 자동 검색 (page도 0으로 초기화)
  useEffect(() => {
    setPage(0); // 페이지도 0으로 초기화
    handleSearch({
      sort: sortOption,
      field: searchField,
      keyword: searchKeyword,
      page: 0,
      size: PAGE_SIZE,
    });
    // eslint-disable-next-line
  }, [sortOption, searchField, searchKeyword]);

  // 2. 페이지가 변경될 때마다 자동 검색
  useEffect(() => {
    handleSearch({
      sort: sortOption,
      field: searchField,
      keyword: searchKeyword,
      page,
      size: PAGE_SIZE,
    });
    // eslint-disable-next-line
  }, [page]);

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
          ? "clamp(0.8rem, 3vw, 1rem)"
          : "clamp(1rem, 4vw, 1.5rem)",
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
          gap: isMobile ? "1rem" : "1.2rem",
          height: "100%",
          position: "relative",
        }}
      >
        {/* 헤더 고정 */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "#f9f9f9",
          }}
        >
          {/* 정렬 옵션 props 추가 */}
          <FreeBoardHeader
            sortOption={sortOption}
            setSortOption={setSortOption}
          />

          <FreeBoardSearchSection
            sort={sortOption}
            setSort={setSortOption}
            searchField={searchField}
            setSearchField={setSearchField}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            onSearch={handleSearch}
            page={0}
            size={10}
          />
        </div>
        {/* 카드 영역 스크롤 */}
        <div
          ref={cardAreaRef}
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0,
            paddingRight: "2px",
            position: "relative",
          }}
        >
          {/* 위쪽 블러 */}
          <div
            style={{
              position: "sticky",
              top: 0,
              left: 0,
              width: "100%",
              height: "10px",
              zIndex: 20,
              pointerEvents: "none",
              background:
                "linear-gradient(to bottom, rgba(249,249,249,0.95) 70%, rgba(249,249,249,0.01) 100%)",
              backdropFilter: "blur(6px)",
            }}
          />
          {/* 아래쪽 블러 */}
          <div
            style={{
              position: "sticky",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "32px",
              zIndex: 20,
              pointerEvents: "none",
              background:
                "linear-gradient(to top, rgba(249,249,249,0.95) 70%, rgba(249,249,249,0.01) 100%)",
              backdropFilter: "blur(6px)",
            }}
          />
          {/* 카드 리스트 */}
          <div>
            {loading ? (
              <div
                style={{
                  color: "#aaa",
                  textAlign: "center",
                  width: "100%",
                  padding: isMobile ? "1.5rem 0" : "2rem 0",
                  fontSize: isMobile ? "1rem" : "1.1rem",
                  fontFamily: "'GmarketSansMedium', sans-serif",
                  lineHeight: "1.6",
                }}
              >
                🐿️ 게시글을 열심히 줍줍(!) 중입니다...
              </div>
            ) : posts.length === 0 ? (
              <div
                style={{
                  color: "#aaa",
                  textAlign: "center",
                  width: "100%",
                  padding: isMobile ? "1.5rem 0" : "2rem 0",
                  fontSize: isMobile ? "1rem" : "1.1rem",
                  fontFamily: "'GmarketSansMedium', sans-serif",
                  lineHeight: "1.6",
                }}
              >
                🐿️ 아직 다람쥐가 도토리를 숨기지 않았어요!
                <br />첫 번째 이야기를 남겨주세요 🌰
              </div>
            ) : (
              posts.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  myUserId={userId}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
            {/* 페이지네이션 버튼 */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: isMobile ? "1.5rem" : "2rem",
                padding: isMobile ? "0 1rem" : "0",
              }}
            >
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
            </div>
          </div>
        </div>
      </div>
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

export default FreeBoardPage;
