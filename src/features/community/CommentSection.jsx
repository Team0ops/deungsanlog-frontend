import React, { useState, useEffect } from "react";
import axios from "axios";
import NicknameWithBadge from "widgets/user/NicknameWithBadge";

const CommentSection = ({ postId, userId, postUserId, onCommentsChanged }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);

  // 댓글 목록 새로고침 함수
  const fetchComments = () => {
    axios
      .get(`http://localhost:8080/community-service/comments?postId=${postId}`)
      .then((res) => setComments(Array.isArray(res.data) ? res.data : []))
      .catch(() => setComments([]));
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 댓글 작성
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await axios.post(`http://localhost:8080/community-service/comments`, {
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

  // 댓글 삭제
  const handleDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/community-service/comments/${commentId}`
      );
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
      <div style={{ marginBottom: "1.2rem" }}>
        {comments.length === 0 ? (
          <div style={{ color: "#aaa" }}>댓글이 없습니다.</div>
        ) : (
          <div
            style={{
              borderTop: "1px solid #e0e0e0",
              paddingTop: "1.2rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem",
            }}
          >
            {comments.map((c) => {
              const canDelete = userId === c.userId || userId === postUserId;
              return (
                <div
                  key={c.id}
                  style={{
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.3rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
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
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
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
                            aria-label="댓글 메뉴"
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
                  <div
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {c.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleComment} style={{ display: "flex", gap: "0.7rem" }}>
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
    </>
  );
};

export default CommentSection;
