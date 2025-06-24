import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FeedCard from "widgets/community/board/FreeCard";
import FreeBoardHeader from "widgets/community/board/FreeBoardHeader";
import FreeBoardSearchSection from "widgets/community/board/FreeBoardSearchSection";
import { getUserInfo } from "shared/lib/auth";
import axiosInstance from "shared/lib/axiosInstance";

const FreeBoardPage = () => {
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("latest");
  const [searchField, setSearchField] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();
  const cardAreaRef = useRef(null);

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
  const handleDelete = async (post) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axiosInstance.delete(`/community-service/posts/${post.id}`);
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
      } catch {
        alert("삭제에 실패했습니다.");
      }
    }
  };

  // 게시글 검색 핸들러
  const handleSearch = async ({
    sort = sortOption,
    field = searchField,
    keyword = searchKeyword,
    page = 0,
    size = 10,
  } = {}) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/community-service/posts/search", {
        params: {
          sort,
          field,
          keyword,
          page,
          size,
        },
      });
      setPosts(res.data);
    } catch {
      setPosts([]);
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
      size: 10,
    });
    // eslint-disable-next-line
  }, []);

  // 1. useEffect로 sortOption, searchField, searchKeyword가 바뀔 때마다 자동 검색
  useEffect(() => {
    handleSearch({
      sort: sortOption,
      field: searchField,
      keyword: searchKeyword,
      page: 0,
      size: 10,
    });
    // eslint-disable-next-line
  }, [sortOption, searchField, searchKeyword]);

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
          gap: "2.5rem",
          height: "100%",
          position: "relative", // 블러 오버레이용
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
            overflowX: "hidden", // ← 추가: 가로 스크롤 제거
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
              height: "32px",
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
                  padding: "2rem 0",
                  fontSize: "1.1rem",
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
                  padding: "2rem 0",
                  fontSize: "1.1rem",
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeBoardPage;
