import React, { useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import NicknameWithBadge from "widgets/user/NicknameWithBadge";
import HeartIcon from "shared/assets/icons/heart_y.svg";
import CommentIcon from "shared/assets/icons/Comment.svg";

const FeedCard = ({ post, myUserId, onEdit, onDelete }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [mountainName, setMountainName] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [isHover, setIsHover] = useState(false); // <-- 조건문 밖에서 선언
  const navigate = useNavigate();

  useEffect(() => {
    if (post.mountainId) {
      fetch(
        `${baseUrl}/mountain-service/name-by-id?mountainId=${post.mountainId}`
      )
        .then((res) => res.json())
        .then((data) => setMountainName(data.name))
        .catch(() => setMountainName(null));
    }
  }, [post.mountainId]);

  const isMine = myUserId === post.userId;

  // 여러 장 사진 처리
  const hasPhotos =
    post.hasImage && post.imageUrls && post.imageUrls.length > 0;
  const totalPhotos = hasPhotos ? post.imageUrls.length : 0;
  const getPhotoUrl = (idx) =>
    post.imageUrls[idx].startsWith("http")
      ? post.imageUrls[idx]
      : `${baseUrl}${post.imageUrls[idx]}`;

  const handlePrev = (e) => {
    e.stopPropagation();
    setPhotoIdx((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setPhotoIdx((prev) => (prev + 1) % totalPhotos);
  };

  const cardHoverStyle = {
    transition: "box-shadow 0.18s, transform 0.13s, background 0.18s",
  };
  const cardHoverActiveStyle = {
    boxShadow: "0 8px 32px 0 rgba(47, 66, 47, 0.18)",
    transform: "translateY(-3px) scale(1.012)",
    background: "#f6f7f6",
  };

  // 사진 없는 카드
  if (!hasPhotos) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          padding: "1.2rem 2rem",
          marginBottom: "1.2rem",
          width: "96%",
          maxWidth: "96%",
          position: "relative",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          minHeight: "140px",
          justifyContent: "center",
          margin: "30px auto", // ← 중앙 정렬
          ...cardHoverStyle,
          ...(isHover ? cardHoverActiveStyle : {}),
        }}
        onClick={() =>
          navigate(`/community/post/${post.id}`, {
            state: { userId: myUserId },
          })
        }
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {/* 상단: 작성자/메뉴 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "0.5rem",
          }}
        >
          <NicknameWithBadge
            userId={post.userId}
            nickname={post.nickname}
            style={{ fontSize: "1rem", fontWeight: 600, color: "#27ae60" }}
          />
          {isMine && (
            <div style={{ position: "relative" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  color: "#000000",
                  outline: "none",
                }}
                title="메뉴"
              >
                ⋮
              </button>
              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "2rem",
                    right: 0,
                    background: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    zIndex: 1000,
                    minWidth: "90px",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onEdit?.(post);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.6rem 1rem",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      outline: "none",
                      fontWeight: 500,
                      color: "#222222",
                      borderBottom: "1px solid #f0f0f0",
                      fontSize: "0.97rem",
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onDelete?.(post);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.6rem 1rem",
                      background: "none",
                      border: "none",
                      outline: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      fontWeight: 500,
                      color: "#e74c3c",
                      fontSize: "0.97rem",
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 제목 */}
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.15rem",
            marginBottom: "0.2rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {post.title}
        </div>

        {/* 글 */}
        <div
          style={{
            fontSize: "1.02rem",
            marginBottom: "0.2rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            maxWidth: "100%",
          }}
        >
          {post.content}
        </div>

        {/* 하단: 산, 날짜, 좋아요, 댓글 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.2rem",
            color: "#888",
            fontSize: "0.97rem",
            marginTop: "auto",
          }}
        >
          {mountainName && (
            <span style={{ color: "#27ae60" }}>🏔️ {mountainName}</span>
          )}
          <span style={{ color: "#aaa" }}>
            {new Date(post.createdAt).toLocaleString()}
          </span>
          <span
            style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
          >
            <img
              src={HeartIcon}
              alt="좋아요"
              style={{ width: 20, height: 20, verticalAlign: "middle" }}
            />
            <span
              style={{ fontSize: "0.97rem", fontWeight: 600, color: "#888" }}
            >
              {post.likeCount}
            </span>
          </span>
          <span
            style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
          >
            <img
              src={CommentIcon}
              alt="댓글"
              style={{ width: 19, height: 19, verticalAlign: "middle" }}
            />
            <span
              style={{ fontSize: "0.97rem", fontWeight: 600, color: "#888" }}
            >
              {post.commentCount}
            </span>
          </span>
        </div>
      </div>
    );
  }

  // 사진 있는 카드
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        padding: "1.2rem",
        marginBottom: "1.2rem",
        width: "96%",
        maxWidth: "96%",
        position: "relative",
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        gap: "2rem",
        alignItems: "stretch",
        minHeight: "220px",
        margin: "30px auto", // ← 중앙 정렬
        ...cardHoverStyle,
        ...(isHover ? cardHoverActiveStyle : {}),
      }}
      onClick={() =>
        navigate(`/community/post/${post.id}`, { state: { userId: myUserId } })
      }
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* 왼쪽: 이미지 영역 */}
      <div
        style={{
          flex: "0 0 240px",
          minWidth: "200px",
          maxWidth: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: "10px",
          overflow: "hidden",
          background: "#f4f8f4",
          height: "200px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <>
          <img
            src={getPhotoUrl(photoIdx)}
            alt={`피드 이미지 ${photoIdx + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {totalPhotos > 1 && (
            <>
              <button
                onClick={handlePrev}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "2rem",
                  color: "rgba(255,255,255,0.7)",
                  outline: "none",
                  cursor: "pointer",
                  zIndex: 5,
                  padding: 0,
                  lineHeight: 1,
                }}
                aria-label="이전 사진"
              >
                <ChevronLeftIcon fontSize="inherit" />
              </button>
              <button
                onClick={handleNext}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "2rem",
                  color: "rgba(255,255,255,0.7)",
                  outline: "none",
                  cursor: "pointer",
                  zIndex: 5,
                  padding: 0,
                  lineHeight: 1,
                }}
                aria-label="다음 사진"
              >
                <ChevronRightIcon fontSize="inherit" />
              </button>
              {/* 하단 인디케이터 */}
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "5px",
                  zIndex: 3,
                }}
              >
                {post.imageUrls.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background:
                        idx === photoIdx ? "#fff" : "rgba(255, 255, 255, 0.5)",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </>
      </div>

      {/* 오른쪽: 본문 영역 */}
      <div
        style={{
          flex: "1 1 0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        {/* 상단: 작성자/메뉴 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <NicknameWithBadge
            userId={post.userId}
            nickname={post.nickname}
            style={{ fontSize: "1rem", fontWeight: 600, color: "#27ae60" }}
          />
          {isMine && (
            <div style={{ position: "relative" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  color: "#000000",
                  outline: "none",
                }}
                title="메뉴"
              >
                ⋮
              </button>
              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "2rem",
                    right: 0,
                    background: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    zIndex: 1000,
                    minWidth: "90px",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onEdit?.(post);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.6rem 1rem",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      fontWeight: 500,
                      color: "#222222",
                      borderBottom: "1px solid #f0f0f0",
                      fontSize: "0.97rem", // 글씨 크기 줄임
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onDelete?.(post);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.6rem 1rem",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      fontWeight: 500,
                      color: "#e74c3c",
                      fontSize: "0.97rem", // 글씨 크기 줄임
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 제목 */}
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.15rem",
            marginBottom: "0.2rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {post.title}
        </div>

        {/* 글 */}
        <div
          style={{
            fontSize: "1.02rem",
            marginBottom: "0.2rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            maxWidth: "100%",
          }}
        >
          {post.content}
        </div>

        {/* 하단: 산, 날짜, 좋아요, 댓글 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.2rem",
            color: "#888",
            fontSize: "0.97rem",
            marginTop: "auto",
          }}
        >
          {mountainName && (
            <span style={{ color: "#27ae60" }}>🏔️ {mountainName}</span>
          )}
          <span style={{ color: "#aaa" }}>
            {new Date(post.createdAt).toLocaleString()}
          </span>
          <span
            style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
          >
            <img
              src={HeartIcon}
              alt="좋아요"
              style={{ width: 20, height: 20, verticalAlign: "middle" }}
            />
            <span
              style={{ fontSize: "0.97rem", fontWeight: 600, color: "#888" }}
            >
              {post.likeCount}
            </span>
          </span>
          <span
            style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
          >
            <img
              src={CommentIcon}
              alt="댓글"
              style={{ width: 19, height: 19, verticalAlign: "middle" }}
            />
            <span
              style={{ fontSize: "0.97rem", fontWeight: 600, color: "#888" }}
            >
              {post.commentCount}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
