import React, { useEffect, useState, useCallback } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import axiosInstance from "shared/lib/axiosInstance";
import CommentSection from "features/community/CommentSection";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { getUserInfo } from "shared/lib/auth";
import NicknameWithBadge from "widgets/user/NicknameWithBadge";
import HeartIconN from "shared/assets/icons/heart_n.svg";
import HeartIconY from "shared/assets/icons/heart_y.svg";
import CommentIcon from "shared/assets/icons/Comment.svg";
import ConfirmModal from "widgets/Modal/ConfirmModal";

const PostDetailPage = ({ onLike }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { postId } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [post, setPost] = useState(null);
  const [mountainName, setMountainName] = useState(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [likePressed, setLikePressed] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 로그인 여부만 체크해서 userId만 저장
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.userId) {
      setUserId(userInfo.userId);
    } else {
      setUserId(null);
    }
  }, []);

  // 댓글 목록 새로고침 함수
  const fetchComments = useCallback(() => {
    axiosInstance
      .get("/community-service/comments", { params: { postId } })
      .then((res) => setComments(Array.isArray(res.data) ? res.data : []))
      .catch(() => setComments([]));
  }, [postId]);

  // 게시글, 댓글, 좋아요 여부 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // 게시글 가져오기
        const res = await axiosInstance.get(
          `/community-service/posts/${postId}`
        );
        const data = res.data;
        setPost(data);
        setLikeCount(data?.likeCount || 0);
        setPhotoIdx(0);

        // 좋아요 여부 가져오기
        if (userId) {
          const likeStatusRes = await axiosInstance.get(
            `/community-service/posts/${postId}/like/status`,
            { params: { userId } }
          );
          setLiked(likeStatusRes.data);
        } else {
          setLiked(false);
        }

        // 산 이름 가져오기
        if (data?.mountainId) {
          const mountainRes = await axiosInstance.get(
            `/mountain-service/name-by-id`,
            { params: { mountainId: data.mountainId } }
          );
          setMountainName(mountainRes.data.name);
        }
      } catch (err) {
        console.error("데이터 로딩 실패", err);
      }
    };

    fetchPost();
  }, [postId, userId]);

  if (!post)
    return (
      <div
        style={{
          padding: isMobile ? "2rem 1rem" : "3rem 2rem",
          textAlign: "center",
          color: "#666",
          fontSize: isMobile ? "1rem" : "1.1rem",
          fontFamily: "'GmarketSansMedium', sans-serif",
          lineHeight: "1.6",
          minHeight: "60vh",
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
            게시글을 열심히 찾고 있어요!
          </div>
          <div
            style={{ fontSize: isMobile ? "0.9rem" : "1rem", color: "#888" }}
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
    );

  const hasPhotos =
    post.hasImage && post.imageUrls && post.imageUrls.length > 0;
  const totalPhotos = hasPhotos ? post.imageUrls.length : 0;
  const getPhotoUrl = (idx) =>
    post.imageUrls[idx].startsWith("http")
      ? post.imageUrls[idx]
      : `${baseUrl}${post.imageUrls[idx]}`;

  const handlePrev = () => {
    setPhotoIdx((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };
  const handleNext = () => {
    setPhotoIdx((prev) => (prev + 1) % totalPhotos);
  };

  const handleLike = async () => {
    try {
      if (!userId) {
        alert("로그인 후 좋아요를 누를 수 있습니다.");
        return;
      }
      if (!liked) {
        await axiosInstance.post(
          `/community-service/posts/${postId}/like?userId=${userId}`
        );
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        await axiosInstance.delete(
          `/community-service/posts/${postId}/like?userId=${userId}`
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

  // 댓글 작성/삭제 후 댓글 목록 새로고침
  const handleCommentsChanged = () => {
    fetchComments();
  };

  // 게시글 삭제
  const handleDeletePost = async () => {
    setShowDeleteModal(true);
  };

  const confirmDeletePost = async () => {
    try {
      await axiosInstance.delete(`/community-service/posts/${postId}`);
      alert("게시글이 삭제되었습니다.");
      navigate("/community/free");
    } catch (err) {
      console.error(err);
      alert("게시글 삭제에 실패했습니다.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // 메뉴 열기/닫기
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <div
      style={{
        maxWidth: isMobile ? "95%" : "90%",
        minWidth: isMobile ? "90%" : "80%",
        margin: "0 auto",
        padding: isMobile
          ? "1.5rem 0.8rem 2rem 0.8rem"
          : "2.2rem 1rem 2.5rem 1rem",
        background: "#fff",
        borderRadius: "18px",
        boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        minHeight: "90vh",
      }}
    >
      {/* 뒤로가기 + 본인 글일 때 메뉴버튼 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: isMobile ? "1rem" : "1.2rem",
          minHeight: "40px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#f4f8f4",
            border: "none",
            color: "#27ae60",
            fontSize: isMobile ? "1rem" : "1.15rem",
            cursor: "pointer",
            borderRadius: "50%",
            width: isMobile ? "40px" : "44px",
            height: isMobile ? "40px" : "44px",
            minWidth: isMobile ? "40px" : "44px",
            minHeight: isMobile ? "40px" : "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(39,174,96,0.07)",
            transition: "background 0.15s",
            marginRight: "auto",
            padding: 0,
            gap: "0.3rem",
          }}
          aria-label="뒤로가기"
          onMouseOver={(e) => (e.currentTarget.style.background = "#e6f6ec")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#f4f8f4")}
        >
          <ArrowBackIosNewIcon
            style={{ fontSize: isMobile ? "1rem" : "1.2rem" }}
          />
        </button>
        {/* 본인 글일 때만 메뉴버튼 노출 */}
        {post && userId === post.userId && (
          <>
            <button
              onClick={handleMenuOpen}
              style={{
                outline: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.3rem",
                marginLeft: "0.5rem",
                color: "#888",
                fontSize: isMobile ? "1.5rem" : "1.7rem",
                display: "flex",
                alignItems: "center",
              }}
              aria-label="게시글 메뉴"
            >
              <MoreVertIcon />
            </button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate(`/community/free/edit/${post.id}`);
                }}
              >
                수정
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleDeletePost();
                }}
                sx={{ color: "#e74c3c" }}
              >
                삭제
              </MenuItem>
            </Menu>
          </>
        )}
      </div>

      {/* 작성자, 날짜 - 사진 위 */}
      <div
        style={{
          color: "#888",
          fontSize: isMobile ? "0.95rem" : "1.01rem",
          marginBottom: isMobile ? "0.6rem" : "0.7rem",
          display: "flex",
          alignItems: "flex-start",
          gap: isMobile ? "0.5rem" : "0.7rem",
          flexDirection: "row",
        }}
      >
        <span
          style={{
            color: "#000000",
            fontWeight: 700,
            fontSize: isMobile ? "1rem" : "1.08rem",
            borderRadius: "8px",
            padding: "0.18em 0.7em 0.18em 0.5em",
            letterSpacing: "0.01em",
            display: "inline-block",
            lineHeight: 1.3,
            minWidth: isMobile ? "80px" : "90px",
          }}
        >
          <NicknameWithBadge
            userId={post.userId}
            nickname={post.nickname}
            style={{
              color: "#2b2b2b",
              fontWeight: 700,
              fontSize: isMobile ? "1rem" : "1.08rem",
              background: "none",
              padding: 0,
              boxShadow: "none",
            }}
          />
          <br />
          <span
            style={{
              color: "#aaa",
              fontWeight: 400,
              fontSize: isMobile ? "0.9rem" : "0.97rem",
            }}
          >
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </span>
      </div>

      {/* 사진 캐러셀 */}
      {hasPhotos && (
        <div
          style={{
            position: "relative",
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            background: "#f4f8f4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: isMobile ? "1rem" : "1.2rem",
            minHeight: isMobile ? "180px" : "220px",
            maxHeight: isMobile ? "400px" : "520px",
          }}
        >
          <img
            src={getPhotoUrl(photoIdx)}
            alt={`피드 이미지 ${photoIdx + 1}`}
            style={{
              maxWidth: "100%",
              maxHeight: isMobile ? "360px" : "480px",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
              background: "#f4f8f4",
            }}
          />
          {totalPhotos > 1 && (
            <>
              <button
                onClick={handlePrev}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: isMobile ? "12px" : "16px",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: isMobile ? "1.8rem" : "2.2rem",
                  color: "rgba(0, 0, 0, 0.55)",
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
                  right: isMobile ? "12px" : "16px",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: isMobile ? "1.8rem" : "2.2rem",
                  color: "rgba(0, 0, 0, 0.55)",
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
                  bottom: isMobile ? "10px" : "14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: isMobile ? "4px" : "6px",
                  zIndex: 3,
                }}
              >
                {post.imageUrls.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: isMobile ? "7px" : "9px",
                      height: isMobile ? "7px" : "9px",
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

      {/* 산 이름 - 사진 아래 */}
      {mountainName && (
        <div
          style={{
            color: "#235a3a",
            fontWeight: 600,
            fontSize: isMobile ? "1rem" : "1.05rem",
            marginBottom: isMobile ? "0.6rem" : "0.7rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          🏔️ {mountainName}
        </div>
      )}

      {/* 제목 */}
      <div
        style={{
          color: "#2b2b2b",
          fontWeight: "bold",
          fontSize: isMobile ? "0.95rem" : "1rem",
          marginBottom: isMobile ? "0.5rem" : "0.6rem",
        }}
      >
        {post.title}
      </div>
      {/* 글 */}
      <div
        style={{
          color: "#2b2b2b",
          fontSize: isMobile ? "0.95rem" : "1rem",
          marginBottom: isMobile ? "0.6rem" : "0.7rem",
          whiteSpace: "pre-line",
          lineHeight: isMobile ? "1.5" : "1.6",
        }}
      >
        {post.content}
      </div>
      {/* 좋아요, 댓글 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "1rem" : "1.2rem",
          marginBottom: isMobile ? "1rem" : "1.1rem",
        }}
      >
        <button
          onClick={async (e) => {
            setLikePressed(true);
            await handleLike(e);
            setTimeout(() => setLikePressed(false), 150);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#222",
            fontSize: isMobile ? "1rem" : "1.08rem",
            cursor: "pointer",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            padding: 0,
            outline: "none",
            boxShadow: "none",
          }}
          tabIndex={0}
          onFocus={(e) => (e.currentTarget.style.outline = "none")}
        >
          <img
            src={liked ? HeartIconY : HeartIconN}
            alt="좋아요"
            style={{
              width: likePressed ? (isMobile ? 32 : 36) : isMobile ? 26 : 30,
              height: likePressed ? (isMobile ? 32 : 36) : isMobile ? 26 : 30,
              verticalAlign: "middle",
              transition: "all 0.13s cubic-bezier(.4,2,.6,1)",
              userSelect: "none",
              pointerEvents: "none",
            }}
            draggable={false}
          />
          <span
            style={{
              fontSize: isMobile ? "1rem" : "1.08rem",
              fontWeight: 700,
            }}
          >
            {likeCount}
          </span>
        </button>
        <span
          style={{
            color: "#222",
            fontSize: isMobile ? "1rem" : "1.08rem",
            display: "flex",
            alignItems: "center",
            gap: "0.2rem",
            fontWeight: 700,
            outline: "none",
            boxShadow: "none",
          }}
          tabIndex={-1}
        >
          <img
            src={CommentIcon}
            alt="댓글"
            style={{
              width: isMobile ? 24 : 28,
              height: isMobile ? 24 : 28,
              verticalAlign: "middle",
              userSelect: "none",
              pointerEvents: "none",
            }}
            draggable={false}
          />
          <span
            style={{
              fontSize: isMobile ? "1rem" : "1.08rem",
              fontWeight: 700,
            }}
          >
            {comments.length}
          </span>
        </span>
      </div>
      <CommentSection
        postId={postId}
        userId={userId}
        postUserId={post.userId}
        onCommentsChanged={handleCommentsChanged}
      />
      <ConfirmModal
        isOpen={showDeleteModal}
        message={
          "게시글을 삭제하면 복구할 수 없습니다.\n정말 삭제하시겠습니까?"
        }
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDeletePost}
        cancelText="취소"
        confirmText="삭제"
      />
    </div>
  );
};

export default PostDetailPage;
