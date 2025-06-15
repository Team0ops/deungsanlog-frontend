import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GreenButton from "shared/ui/greenButton";
import FeedCard from "../../widgets/community/board/FreeCard";

const FreeBoardPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 11; // 예시로 1을 할당, 실제론 로그인한 유저의 id를 가져와야 함

  const handleWriteClick = () => {
    navigate("/community/free/write");
  };

  const handleEdit = (postId) => {
    // 수정 로직
    console.log("Edit post with id:", postId);
  };

  // 게시글 삭제 함수 예시
  const handleDelete = async (post) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await fetch(
          `http://localhost:8080/community-service/posts/${post.id}`,
          {
            method: "DELETE",
          }
        );
        // 삭제 후 목록 갱신
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
      } catch {
        alert("삭제에 실패했습니다.");
      }
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/community-service/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        minWidth: "90%",
        maxWidth: "100%",
        minHeight: "40vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "none",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "clamp(1rem, 4vw, 1.5rem)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        position: "relative",
      }}
    >
      <h2
        style={{ fontSize: "1.5rem", color: "#2ecc71", marginBottom: "1rem" }}
      >
        📝 자유게시판
      </h2>

      {/* 글 작성 버튼 */}
      <GreenButton
        onClick={handleWriteClick}
        style={{
          fontSize: "1.08rem",
          background: "#4b8161",
          padding: "0.6rem 1.5rem",
          borderRadius: "0.7rem",
          marginBottom: "1.5rem",
          alignSelf: "flex-end",
        }}
      >
        ✏️ 글 작성하기
      </GreenButton>

      {loading ? (
        <div
          style={{ color: "#27ae60", textAlign: "center", marginTop: "2rem" }}
        >
          게시글을 불러오는 중입니다...
        </div>
      ) : posts.length === 0 ? (
        <div style={{ color: "#888", textAlign: "center", marginTop: "2rem" }}>
          아직 게시글이 없습니다.
        </div>
      ) : (
        posts.map((post) => (
          <FeedCard
            key={post.id}
            post={post}
            myUserId={userId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default FreeBoardPage;
