import { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import axiosInstance from "shared/lib/axiosInstance";
import NicknameWithBadge from "widgets/user/NicknameWithBadge";
import GreenButton from "shared/ui/greenButton";
import GreenInput from "shared/ui/greenInput";
import ConfirmModal from "widgets/Modal/ConfirmModal";
import LoginRequiredModal from "shared/components/LoginRequiredModal";

const CommentSection = ({ postId, userId, postUserId, onCommentsChanged }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [replyOpenMap, setReplyOpenMap] = useState({});
  const [replyInputMap, setReplyInputMap] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 상대적 시간 계산 함수
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "방금 전";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}주 전`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}개월 전`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}년 전`;
  };

  // 댓글 목록 새로고침 함수
  const fetchComments = () => {
    axiosInstance
      .get(`/community-service/comments`, { params: { postId } })
      .then((res) => setComments(Array.isArray(res.data) ? res.data : []))
      .catch(() => setComments([]));
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  useEffect(() => {
    console.log("🔥 댓글 데이터 확인", comments);
  }, [comments]);
  // 댓글 작성
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    // 로그인 체크
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    try {
      await axiosInstance.post(`/community-service/comments`, {
        postId,
        userId,
        content: comment,
      });
      setComment("");
      fetchComments();
      onCommentsChanged?.(); // 댓글 개수 새로고침
    } catch {
      alert("댓글 등록 실패");
    }
  };

  // 대댓글 입력 토글
  const toggleReplyInput = (commentId) => {
    setReplyOpenMap((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // 대댓글 입력
  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    const content = replyInputMap[parentId]?.trim();
    if (!content) return;

    // 로그인 체크
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    try {
      await axiosInstance.post(`/community-service/comments`, {
        postId,
        userId,
        content,
        parentCommentId: parentId,
      });

      // 상태 초기화
      setReplyInputMap((prev) => ({ ...prev, [parentId]: "" }));
      setReplyOpenMap((prev) => ({ ...prev, [parentId]: false }));
      fetchComments();
      onCommentsChanged?.();
    } catch {
      alert("대댓글 등록 실패");
    }
  };

  const renderComments = (parentId = null, level = 0) => {
    return comments
      .filter((c) => c.parentCommentId === parentId)
      .map((c) => {
        const canDelete = userId === c.userId || userId === postUserId;
        const replyOpen = replyOpenMap[c.id];

        return (
          <div
            key={c.id}
            style={{
              marginLeft: `${level * (isMobile ? 15 : 20)}px`, // 들여쓰기
              padding: isMobile ? "0.6rem" : "0.8rem",
              borderRadius: "10px",
              background: "rgba(39,174,96,0.05)",
              border: "1px solid rgba(39,174,96,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "0.2rem" : "0.3rem",
              position: "relative",
            }}
          >
            {/* 닉네임, 시간, 삭제 메뉴 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: isMobile ? "0.2rem" : "0.3rem",
              }}
            >
              <NicknameWithBadge
                userId={c.userId}
                nickname={c.nickname}
                style={{
                  fontWeight: 600,
                  fontSize: isMobile ? "0.95rem" : "1.05rem",
                  color: "#333",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? "0.3rem" : "0.4rem",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    color: "#aaa",
                  }}
                >
                  {getRelativeTime(c.createdAt)}
                </div>
                {canDelete && (
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() => handleMenuClick(c.id)}
                      style={{
                        outline: "none",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: isMobile ? "1.1rem" : "1.3rem",
                        color: "#888",
                        padding: 0,
                        marginLeft: isMobile ? "0.1rem" : "0.2rem",
                      }}
                    >
                      ⋯
                    </button>
                    {menuOpenId === c.id && (
                      <div
                        style={{
                          position: "absolute",
                          top: "1.8rem",
                          right: 0,
                          background: "#fff",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          zIndex: 10,
                        }}
                      >
                        <button
                          onClick={() => {
                            handleDeleteClick(c.id);
                            setMenuOpenId(null);
                          }}
                          style={{
                            background: "none",
                            fontSize: isMobile ? "0.9rem" : "1rem",
                            outline: "none",
                            border: "none",
                            color: "#961c1c",
                            fontWeight: 500,
                            padding: isMobile ? "0.6rem 1rem" : "0.7rem 1.2rem",
                            cursor: "pointer",
                            width: "auto",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                            minWidth: isMobile ? "48px" : "56px",
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 댓글 내용 */}
            <div
              style={{
                fontSize: isMobile ? "0.95rem" : "1rem",
                color: "#555",
                whiteSpace: "pre-line",
                lineHeight: isMobile ? "1.4" : "1.5",
              }}
            >
              {c.content}
            </div>

            {/* 댓글 달기 버튼: level이 1 미만일 때만 표시 */}
            {level < 1 && (
              <div
                style={{
                  marginTop: isMobile ? "0.4rem" : "0.5rem",
                  textAlign: "right",
                }}
              >
                <button
                  onClick={() => toggleReplyInput(c.id)}
                  style={{
                    outline: "none",
                    background: "none",
                    border: "none",
                    color: "#345e45",
                    fontSize: isMobile ? "0.8rem" : "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  {replyOpen ? "작성 취소" : "댓글 달기"}
                </button>
              </div>
            )}

            {/* 대댓글 입력창: level이 1 미만일 때만 표시 */}
            {level < 1 && replyOpen && (
              <form
                onSubmit={(e) => handleReplySubmit(e, c.id)}
                style={{
                  marginTop: isMobile ? "0.5rem" : "0.6rem",
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "0.4rem" : "0.5rem",
                  width: "100%",
                }}
              >
                <GreenInput
                  value={replyInputMap[c.id] || ""}
                  onChange={(e) =>
                    setReplyInputMap((prev) => ({
                      ...prev,
                      [c.id]: e.target.value,
                    }))
                  }
                  placeholder="대댓글을 입력하세요"
                  style={{
                    fontSize: isMobile ? "1rem" : "1.05rem",
                    flex: 1,
                    marginBottom: 0,
                    background: "#fff",
                    border: "1.5px solid #e0e0e0",
                    transition: "border 0.2s",
                    boxShadow: "none",
                    height: isMobile ? "40px" : "auto",
                  }}
                  maxLength={200}
                  onFocus={(e) =>
                    (e.target.style.border = "1.5px solid #98ceae")
                  }
                  onBlur={(e) =>
                    (e.target.style.border = "1.5px solid #e0e0e0")
                  }
                />
                <GreenButton
                  type="submit"
                  style={{
                    padding: isMobile ? "0.6rem 1.2rem" : "0.7rem 1.5rem",
                    fontWeight: 500,
                    fontSize: isMobile ? "1rem" : "1.05rem",
                    borderRadius: "8px",
                    whiteSpace: "nowrap",
                    background: "#688574",
                    color: "#ffffff",
                    border: "none",
                    boxShadow: "none",
                    height: isMobile ? "44px" : "auto",
                    alignSelf: isMobile ? "flex-end" : "auto",
                  }}
                >
                  등록
                </GreenButton>
              </form>
            )}

            {/* 하위 대댓글들 재귀 렌더링 */}
            {renderComments(c.id, level + 1)}
          </div>
        );
      });
  };

  const handleDeleteClick = (commentId) => {
    setDeleteTargetId(commentId);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(
        `/community-service/comments/${deleteTargetId}`
      );
      fetchComments();
      onCommentsChanged?.();
    } catch {
      alert("댓글 삭제 실패");
    } finally {
      setShowConfirmModal(false);
      setDeleteTargetId(null);
      setMenuOpenId(null);
    }
  };
  const handleMenuClick = (commentId) => {
    setMenuOpenId(menuOpenId === commentId ? null : commentId);
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    window.location.href = "/login";
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <div
        style={{
          marginBottom: isMobile ? "1rem" : "1.2rem",
          minHeight: "300px",
        }}
      >
        {/* 항상 구분선 표시 */}
        <div
          style={{
            borderTop: "1px solid #e0e0e0",
            paddingTop: isMobile ? "1rem" : "1.2rem",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "0.6rem" : "0.8rem",
          }}
        >
          {comments.length === 0 ? (
            <div
              style={{
                color: "#888",
                textAlign: "center",
                marginTop: 0,
                fontSize: isMobile ? "0.95rem" : "1rem",
                lineHeight: 1.6,
                minHeight: isMobile ? "180px" : "220px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              🐿️ 아직 댓글이 없어요! <br />첫 도토리를 남겨볼까요? 🌰
            </div>
          ) : (
            renderComments()
          )}
        </div>
      </div>

      <form
        onSubmit={handleComment}
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          gap: isMobile ? "0.4rem" : "0.6rem",
          width: "100%",
          marginTop: isMobile ? "1.2rem" : "1.5rem",
        }}
      >
        <GreenInput
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글로 마음을 나눠보세요!"
          style={{
            fontSize: isMobile ? "1rem" : "1.05rem",
            flex: 1,
            marginBottom: 0,
            background: "#fff",
            border: "1.5px solid #e0e0e0",
            transition: "border 0.2s",
            boxShadow: "none",
            height: isMobile ? "44px" : "auto",
          }}
          maxLength={200}
          onFocus={(e) => (e.target.style.border = "1.5px solid #98ceae")}
          onBlur={(e) => (e.target.style.border = "1.5px solid #e0e0e0")}
        />
        <GreenButton
          type="submit"
          style={{
            padding: isMobile ? "0.6rem 1.2rem" : "0.7rem 1.5rem",
            fontWeight: 500,
            fontSize: isMobile ? "1rem" : "1.05rem",
            borderRadius: "8px",
            whiteSpace: "nowrap",
            background: "#688574",
            color: "#ffffff",
            border: "none",
            boxShadow: "none",
            height: isMobile ? "44px" : "auto",
            alignSelf: isMobile ? "flex-end" : "auto",
          }}
        >
          등록
        </GreenButton>
      </form>

      {/* ConfirmModal 적용 */}
      <ConfirmModal
        isOpen={showConfirmModal}
        message={"삭제한 댓글은 복구되지 않습니다.\n댓글을 삭제하시겠습니까?"}
        onCancel={() => {
          setShowConfirmModal(false);
          setDeleteTargetId(null);
          setMenuOpenId(null);
        }}
        onConfirm={handleDeleteConfirm}
        cancelText="취소"
        confirmText="삭제"
      />

      {/* 로그인 안내 모달 */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={handleCloseLoginModal}
        onLogin={handleLogin}
        title="로그인이 필요한 서비스입니다"
        message={`댓글을 작성하려면
로그인이 필요해요!`}
      />
    </>
  );
};

export default CommentSection;
