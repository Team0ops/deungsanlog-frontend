import GreenButton from "shared/ui/greenButton";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NicknameWithBadge from "widgets/user/NicknameWithBadge"; // 추가

// 공통 미리보기 카드
const PreviewCard = ({ post }) => {
  const navigate = useNavigate();

  const isTextOnly =
    !post.hasImage || !post.imageUrls || post.imageUrls.length === 0;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "240px",
        minWidth: "240px",
        height: isTextOnly ? "180px" : "300px",
        background: "#f7faf7",
        borderRadius: "12px",
        padding: "0.7rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        flex: "0 0 auto",
        boxSizing: "border-box",
        touchAction: "manipulation",
      }}
      onClick={() => navigate(`/community/post/${post.id}`)}
    >
      {/* 이미지 */}
      {post.hasImage && post.imageUrls?.length > 0 && (
        <div
          style={{
            width: "100%",
            aspectRatio: "4 / 3",
            marginBottom: "0.4rem",
            borderRadius: "8px",
            overflow: "hidden",
            background: "#eee",
            flexShrink: 0,
          }}
        >
          <img
            src={
              post.imageUrls[0].startsWith("http")
                ? post.imageUrls[0]
                : `http://localhost:8080${post.imageUrls[0]}`
            }
            alt="미리보기"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}
      {/* 제목 */}
      <div
        style={{
          fontWeight: 600,
          fontSize: "0.85rem",
          color: "#555555",
          marginBottom: "0.3rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {post.title}
      </div>
      {/* 내용 */}
      {post.content && (
        <div
          style={{
            fontSize: "0.7rem",
            color: "#575757",
            lineHeight: 1.3,
            marginBottom: isTextOnly ? "0.5rem" : 0,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: isTextOnly ? 5 : 2,
            WebkitBoxOrient: "vertical",
            height: isTextOnly ? "6.5em" : "2.5em",
            whiteSpace: "normal",
          }}
        >
          {post.content}
        </div>
      )}
      {/* 하단 정보: 항상 카드 맨 아래에 붙도록 marginTop: auto */}
      <div
        style={{
          marginTop: "auto",
          fontSize: "0.85rem",
          color: "#999",
          display: "flex",
          flexDirection: "column",
          gap: "0.2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <NicknameWithBadge
            userId={post.userId}
            nickname={post.nickname}
            style={{ fontSize: "0.85rem", color: "#555" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.7rem",
            alignItems: "center",
            marginTop: "0.1rem",
          }}
        >
          <span
            style={{
              color: "#e74c3c",
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
            }}
          >
            ❤️ {post.likeCount ?? 0}
          </span>
          <span
            style={{
              color: "#4b8161",
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
            }}
          >
            💬 {post.commentCount ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};

// 전체 배너
const FreeBoardBanner = ({ onClick, previewPosts = [] }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 마우스 드래그 핸들러
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2; // 스크롤 속도 조절
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleMouseUp = () => setIsDragging(false);

  // 터치 드래그 핸들러
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "950px",
        minWidth: "0",
        margin: "0 auto",
        padding: "clamp(1rem, 4vw, 1.5rem)",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        overflow: "visible", // 변경: 내용물이 넘치면 박스가 늘어나도록
        position: "relative",
        boxSizing: "border-box",
        minHeight: "40vh",
        maxHeight: "none", // 제한 해제
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          📢 이야기광장
        </h3>
        <GreenButton
          onClick={onClick}
          style={{
            fontSize: "1.08rem",
            background: "#4b8161",
            padding: "0.6rem 1.5rem",
            borderRadius: "0.7rem",
          }}
        >
          전체 글 보기 ↗
        </GreenButton>
      </div>

      <p
        style={{
          color: "#555",
          fontSize: "0.95rem",
          lineHeight: 1.5,
          marginTop: "0.4rem",
          marginBottom: "1.2rem",
        }}
      >
        최신 게시글과 등산러들의 다양한 산 이야기를 구경하세요 !
      </p>

      <div
        ref={scrollRef}
        className="custom-horizontal-scroll"
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          scrollBehavior: "smooth",
          paddingBottom: "1.2rem", // 스크롤바 위 여백 확보 (기존 0.5rem → 1.2rem 등)
          scrollbarWidth: "auto",
          msOverflowStyle: "auto",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          width: "100%",
          boxSizing: "border-box",
          alignItems: "center",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {previewPosts.length === 0 ? (
          <div
            style={{
              color: "#bbb",
              textAlign: "center",
              width: "100%",
              padding: "1.5rem 0",
            }}
          >
            게시물이 없습니다.
          </div>
        ) : (
          <>
            {previewPosts.map((post) => (
              <PreviewCard key={post.id} post={post} />
            ))}
            {/* 맨 오른쪽 동그란 버튼 */}
            <div
              style={{
                flex: "0 0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                onClick={onClick}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#8fbea2",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="더보기"
              >
                ⋯
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FreeBoardBanner;
