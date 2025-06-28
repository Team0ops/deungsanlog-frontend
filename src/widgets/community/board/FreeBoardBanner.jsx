import GreenButton from "shared/ui/greenButton";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NicknameWithBadge from "widgets/user/NicknameWithBadge"; // 추가
import HeartIcon from "shared/assets/icons/heart_y.svg";
import CommentIcon from "shared/assets/icons/Comment.svg";
import { useTheme, useMediaQuery } from "@mui/material";

// 공통 미리보기 카드
const cardHoverStyle = {
  transition: "box-shadow 0.2s, transform 0.15s, background 0.2s",
};
const cardHoverActiveStyle = {
  boxShadow: "0 8px 24px rgba(28, 48, 34, 0.2)",
  transform: "translateY(-4px) scale(1.025)",
  background: "#f5f8f5",
};

const PreviewCard = ({ post }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const isTextOnly =
    !post.hasImage || !post.imageUrls || post.imageUrls.length === 0;

  const [isHover, setIsHover] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "240px",
        minWidth: "240px",
        height: isTextOnly ? "180px" : "300px",
        background: "#f5f8f5",
        borderRadius: "12px",
        padding: "0.7rem",
        boxShadow: "0 2px 8px rgba(14, 44, 15, 0.2)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        flex: "0 0 auto",
        boxSizing: "border-box",
        touchAction: "manipulation",
        marginLeft: "13px",
        marginTop: "13px",
        ...cardHoverStyle,
        ...(isHover ? cardHoverActiveStyle : {}),
      }}
      onClick={() => navigate(`/community/post/${post.id}`)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
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
                : `${baseUrl}${post.imageUrls[0]}`
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
      {/* 하단 정보 */}
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
              color: "#4b8161",
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
            }}
          >
            <img
              src={HeartIcon}
              alt="좋아요"
              style={{ width: 16, height: 16, verticalAlign: "middle" }}
            />
            {post.likeCount ?? 0}
          </span>
          <span
            style={{
              color: "#4b8161",
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
            }}
          >
            <img
              src={CommentIcon}
              alt="댓글"
              style={{ width: 16, height: 16, verticalAlign: "middle" }}
            />
            {post.commentCount ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};

// 전체 배너
const FreeBoardBanner = ({ onClick, previewPosts = [] }) => {
  const safePosts = Array.isArray(previewPosts) ? previewPosts : [];
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        maxWidth: "none",
        minWidth: 0,
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
        <h3
          style={{
            fontWeight: "bold",
            fontSize: isMobile ? "1.2rem" : "1.5rem",
          }}
        >
          📢 이야기광장
        </h3>
        <GreenButton
          onClick={onClick}
          style={{
            fontSize: isMobile ? "0.98rem" : "1.02rem",
            background: "#769b85",
            padding: isMobile ? "0.45rem 1.1rem" : "0.5rem 1.2rem",
            borderRadius: "0.7rem",
            minWidth: isMobile ? "auto" : "110px",
            height: isMobile ? "2.1rem" : "2.3rem",
            lineHeight: 1.1,
            fontWeight: 600,
          }}
        >
          {isMobile ? "광장 입장하기" : "광장 입장하기 ↗"}
        </GreenButton>
      </div>

      <p
        style={{
          color: "#555",
          fontSize: "0.95rem",
          lineHeight: 1.5,
          marginTop: "0.7rem",
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
              color: "#aaa",
              textAlign: "center",
              width: "100%",
              padding: "2rem 0",
              fontSize: "1.1rem",
              fontFamily: "'GmarketSansMedium', sans-serif",
              lineHeight: "1.6",
            }}
          >
            <div style={{ fontSize: "2rem" }}>🗻✨</div>
            <div>새로운 이야기를 기다리는 중이에요 ⏳</div>
          </div>
        ) : (
          <>
            {safePosts.map((post) => (
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
