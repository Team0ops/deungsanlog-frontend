import { useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const FeedCard = ({ post, myUserId, onEdit, onDelete }) => {
  const [mountainName, setMountainName] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    if (post.mountainId) {
      fetch(
        `http://localhost:8080/mountain-service/name-by-id?mountainId=${post.mountainId}`
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
      : `http://localhost:8080${post.imageUrls[idx]}`;

  const handlePrev = (e) => {
    e.stopPropagation();
    setPhotoIdx((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setPhotoIdx((prev) => (prev + 1) % totalPhotos);
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        padding: "1.2rem",
        marginBottom: "1.2rem",
        width: "100%",
        maxWidth: "600px",
        position: "relative",
      }}
    >
      {/* 메뉴 버튼 (본인 게시물일 때만) */}
      {isMine && (
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.4rem",
              cursor: "pointer",
              color: "#444444",
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
                zIndex: 10,
                minWidth: "90px",
              }}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.(post);
                }}
                style={{
                  width: "100%",
                  padding: "0.7rem 1rem",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontWeight: 500,
                  color: "#27ae60",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                ✏️ 수정
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.(post);
                }}
                style={{
                  width: "100%",
                  padding: "0.7rem 1rem",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontWeight: 500,
                  color: "#e74c3c",
                }}
              >
                🗑️ 삭제
              </button>
            </div>
          )}
        </div>
      )}

      {/* 여러 장 사진 캐러셀 */}
      {hasPhotos && (
        <div
          style={{
            position: "relative",
            width: "100%",
            marginBottom: "0.8rem",
            borderRadius: "10px",
            overflow: "hidden",
            height: "clamp(440px, 65vw, 520px)",
            background: "#f4f8f4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: "70vw",
            minHeight: "440px",
          }}
        >
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
                  left: "16px",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "2.2rem",
                  color: "rgba(255,255,255,0.55)",
                  outline: "none",
                  cursor: "pointer",
                  zIndex: 5,
                  padding: 0,
                  lineHeight: 1,
                  transition: "color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="이전 사진"
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.85)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
                }
              >
                <ChevronLeftIcon fontSize="inherit" />
              </button>
              <button
                onClick={handleNext}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "16px",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "2.2rem",
                  color: "rgba(255,255,255,0.55)",
                  outline: "none",
                  cursor: "pointer",
                  zIndex: 5,
                  padding: 0,
                  lineHeight: 1,
                  transition: "color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="다음 사진"
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.85)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
                }
              >
                <ChevronRightIcon fontSize="inherit" />
              </button>
              {/* 하단 인디케이터 */}
              <div
                style={{
                  position: "absolute",
                  bottom: "14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "6px",
                  zIndex: 3,
                }}
              >
                {post.imageUrls.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: "9px",
                      height: "9px",
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
        </div>
      )}

      {/* 제목 */}
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.15rem",
          marginBottom: "0.2rem",
        }}
      >
        {post.title}
      </div>

      {/* 글 */}
      <div style={{ fontSize: "1.02rem", marginBottom: "0.2rem" }}>
        {post.content}
      </div>

      {/* 작성자, 산, 날짜 */}
      <div
        style={{
          color: "#888",
          fontSize: "0.97rem",
          marginBottom: "0.2rem",
        }}
      >
        작성자: <b style={{ color: "#27ae60" }}>{post.nickname}</b>
        {mountainName && (
          <span style={{ marginLeft: "0.7rem", color: "#27ae60" }}>
            🏔️ {mountainName}
          </span>
        )}
        <span style={{ marginLeft: "0.7rem", color: "#aaa" }}>
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>

      {/* 하트, 댓글 */}
      <div
        style={{
          color: "#888",
          fontSize: "0.98rem",
          marginTop: "0.2rem",
        }}
      >
        ❤️ {post.likeCount} &nbsp; 💬 {post.commentCount}
      </div>
    </div>
  );
};

export default FeedCard;
