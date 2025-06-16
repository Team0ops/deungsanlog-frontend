import React, { useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PostDetailPage = ({ onLike, onComment }) => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const userId = 11; // 하드코딩 또는 location.state?.userId 등으로 받아올 수 있음
  const [post, setPost] = useState(null);
  const [mountainName, setMountainName] = useState(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [comment, setComment] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/community-service/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("상세 데이터:", data); // 실제 데이터 구조 확인
        setPost(data);
        setLikeCount(data?.likeCount || 0);
        setLiked(false);
        setPhotoIdx(0);
        setComment("");
        if (data?.mountainId) {
          fetch(
            `http://localhost:8080/mountain-service/name-by-id?mountainId=${data.mountainId}`
          )
            .then((res) => res.json())
            .then((mountain) => setMountainName(mountain.name))
            .catch(() => setMountainName(null));
        }
      });
  }, [postId]);

  if (!post) return <div style={{ padding: "2rem" }}>로딩 중...</div>;

  const hasPhotos =
    post.hasImage && post.imageUrls && post.imageUrls.length > 0;
  const totalPhotos = hasPhotos ? post.imageUrls.length : 0;
  const getPhotoUrl = (idx) =>
    post.imageUrls[idx].startsWith("http")
      ? post.imageUrls[idx]
      : `http://localhost:8080${post.imageUrls[idx]}`;

  const handlePrev = () => {
    setPhotoIdx((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };
  const handleNext = () => {
    setPhotoIdx((prev) => (prev + 1) % totalPhotos);
  };

  const handleLike = async () => {
    try {
      if (!liked) {
        // 좋아요
        await axios.post(
          `http://localhost:8080/community-service/posts/${postId}/like?userId=${userId}`
        );
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        // 좋아요 취소
        await axios.delete(
          `http://localhost:8080/community-service/posts/${postId}/like?userId=${userId}`
        );
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
      onLike?.(post);
    } catch (err) {
      console.error(err);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment?.(comment, post);
      setComment("");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "2.2rem 1rem 2.5rem 1rem",
        background: "#fff",
        borderRadius: "18px",
        boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        minHeight: "90vh",
      }}
    >
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          color: "#27ae60",
          fontSize: "1.5rem",
          cursor: "pointer",
          marginBottom: "1.2rem",
        }}
        aria-label="뒤로가기"
      >
        ← 뒤로가기
      </button>

      {/* 사진 캐러셀 */}
      {hasPhotos && (
        <div
          style={{
            position: "relative",
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            height: "clamp(340px, 48vw, 420px)",
            background: "#f4f8f4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.2rem",
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
          fontSize: "1.25rem",
          marginBottom: "0.6rem",
        }}
      >
        {post.title}
      </div>

      {/* 글 */}
      <div
        style={{
          fontSize: "1.08rem",
          marginBottom: "0.7rem",
          whiteSpace: "pre-line",
        }}
      >
        {post.content}
      </div>

      {/* 작성자, 산, 날짜 */}
      <div
        style={{
          color: "#888",
          fontSize: "1.01rem",
          marginBottom: "0.7rem",
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

      {/* 좋아요, 댓글 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.2rem",
          marginBottom: "1.1rem",
        }}
      >
        <button
          onClick={handleLike}
          style={{
            background: "none",
            border: "none",
            color: liked ? "#e74c3c" : "#888",
            fontSize: "1.25rem",
            cursor: "pointer",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          ❤️ {likeCount}
        </button>
        <span style={{ color: "#888", fontSize: "1.08rem" }}>
          💬 {post.commentCount}
        </span>
      </div>

      {/* 댓글 입력 */}
      <form
        onSubmit={handleComment}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
        }}
      >
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          style={{
            flex: 1,
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "0.7rem 1rem",
            fontSize: "1.05rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#27ae60",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.7rem 1.2rem",
            fontWeight: 600,
            fontSize: "1.05rem",
            cursor: "pointer",
          }}
        >
          등록
        </button>
      </form>
    </div>
  );
};

export default PostDetailPage;
