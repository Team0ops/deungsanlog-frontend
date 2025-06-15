import { useEffect, useState } from "react";

const FeedCard = ({ post, myUserId, onEdit, onDelete }) => {
  const [mountainName, setMountainName] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

      {/* 사진 */}
      {post.hasImage && post.imageUrls && post.imageUrls.length > 0 && (
        <img
          src={
            post.imageUrls[0].startsWith("http")
              ? post.imageUrls[0]
              : `http://localhost:8080${post.imageUrls[0]}`
          }
          alt="피드 이미지"
          style={{
            width: "100%",
            borderRadius: "10px",
            objectFit: "cover",
            marginBottom: "0.5rem",
          }}
        />
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
