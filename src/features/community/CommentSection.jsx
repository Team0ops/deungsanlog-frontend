import { useState, useEffect } from "react";
import axiosInstance from "shared/lib/axiosInstance";
import NicknameWithBadge from "widgets/user/NicknameWithBadge";
import GreenButton from "shared/ui/greenButton";
import GreenInput from "shared/ui/greenInput";

const CommentSection = ({ postId, userId, postUserId, onCommentsChanged }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [replyOpenMap, setReplyOpenMap] = useState({});
  const [replyInputMap, setReplyInputMap] = useState({});

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
  }; // ← 여기까지가 handleComment 함수의 끝입니다.

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
              marginLeft: `${level * 20}px`, // 들여쓰기
              padding: "0.8rem",
              borderRadius: "10px",
              background: "rgba(39,174,96,0.05)",
              border: "1px solid rgba(39,174,96,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "0.3rem",
              position: "relative",
            }}
          >
            {/* 닉네임, 시간, 삭제 메뉴 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.3rem",
              }}
            >
              <NicknameWithBadge
                userId={c.userId}
                nickname={c.nickname}
                style={{
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  color: "#333",
                }}
              />
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <div style={{ fontSize: "0.9rem", color: "#aaa" }}>
                  {new Date(c.createdAt).toLocaleString()}
                </div>
                {canDelete && (
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() => handleMenuClick(c.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.3rem",
                        color: "#888",
                        padding: 0,
                        marginLeft: "0.2rem",
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
                            handleDelete(c.id);
                            setMenuOpenId(null);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#e74c3c",
                            fontWeight: 600,
                            padding: "0.7rem 1.2rem",
                            cursor: "pointer",
                            width: "100%",
                            textAlign: "left",
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
                fontSize: "1rem",
                color: "#555",
                whiteSpace: "pre-line",
              }}
            >
              {c.content}
            </div>

            {/* 댓글 달기 버튼: level이 1 미만일 때만 표시 */}
            {level < 1 && (
              <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
                <button
                  onClick={() => toggleReplyInput(c.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#27ae60",
                    fontSize: "0.85rem",
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
                  marginTop: "0.6rem",
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <input
                  type="text"
                  value={replyInputMap[c.id] || ""}
                  onChange={(e) =>
                    setReplyInputMap((prev) => ({
                      ...prev,
                      [c.id]: e.target.value,
                    }))
                  }
                  placeholder="대댓글을 입력하세요"
                  style={{
                    flex: 1,
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    padding: "0.6rem",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "#27ae60",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.6rem 1rem",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  등록
                </button>
              </form>
            )}

            {/* 하위 대댓글들 재귀 렌더링 */}
            {renderComments(c.id, level + 1)}
          </div>
        );
      });
  };

  // 댓글 삭제
  const handleDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await axiosInstance.delete(`/community-service/comments/${commentId}`);
      fetchComments();
      onCommentsChanged?.(); // 댓글 개수 새로고침
    } catch {
      alert("댓글 삭제 실패");
    }
  };

  const handleMenuClick = (commentId) => {
    setMenuOpenId(menuOpenId === commentId ? null : commentId);
  };

  return (
    <>
      <div style={{ marginBottom: "1.2rem", minHeight: "300px" }}>
        {/* 항상 구분선 표시 */}
        <div
          style={{
            borderTop: "1px solid #e0e0e0",
            paddingTop: "1.2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
          }}
        >
          {comments.length === 0 ? (
            <div
              style={{
                color: "#888",
                textAlign: "center",
                marginTop: 0,
                fontSize: "1rem",
                lineHeight: 1.6,
                minHeight: "220px",
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
          alignItems: "center",
          gap: "0.6rem",
          width: "100%",
          marginTop: "1.5rem",
        }}
      >
        <GreenInput
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글로 마음을 나눠보세요!"
          style={{
            fontSize: "1.05rem",
            flex: 1,
            marginBottom: 0,
          }}
          maxLength={200}
        />
        <GreenButton
          type="submit"
          style={{
            padding: "0.7rem 1.5rem",
            fontWeight: 600,
            fontSize: "1.05rem",
            borderRadius: "8px",
            whiteSpace: "nowrap",
          }}
        >
          등록
        </GreenButton>
      </form>
    </>
  );
};

export default CommentSection;
