import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GreenButton from "shared/ui/greenButton";
import FeedCard from "widgets/community/board/FreeCard";
import FreeBoardHeader from "widgets/community/board/FreeBoardHeader";
import { getUserInfo } from "shared/lib/auth";

const FreeBoardPage = () => {
  const [userId, setUserId] = useState(null); // 로그인 유저 정보 저장
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 로그인 여부만 체크해서 userId만 저장
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.userId) {
      setUserId(userInfo.userId);
    } else {
      setUserId(null); // 비로그인 시 null
    }
  }, []);

  const handleEdit = (post) => {
    navigate(`/community/free/edit/${post.id}`);
  };

  const handleDelete = async (post) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await fetch(
          `http://localhost:8080/community-service/posts/${post.id}`,
          {
            method: "DELETE",
          }
        );
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
        backgroundColor: "transparent",
        borderRadius: "20px",
        padding: "clamp(1rem, 4vw, 1.5rem)",
        position: "relative",
      }}
    >
      <FreeBoardHeader />
      {loading ? (
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
          🐿️ 게시글을 열심히 줍줍(!) 중입니다...
        </div>
      ) : posts.length === 0 ? (
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
          🐿️ 아직 다람쥐가 도토리를 숨기지 않았어요!
          <br />첫 번째 이야기를 남겨주세요 🌰
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
