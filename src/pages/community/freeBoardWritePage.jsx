import { useEffect, useState } from "react";
import { getUserInfo } from "shared/lib/auth";
import FreeBoardForm from "../../widgets/community/writeForm/FreeBoardForm";

const FreeBoardWritePage = () => {
  const [userId, setUserId] = useState(null);

  // 로그인 여부만 체크해서 userId만 저장
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.userId) {
      setUserId(userInfo.userId);
    } else {
      setUserId(null); // 비로그인 시 null
    }
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        overflowY: "auto", // ✅ 내부 스크롤 가능하도록
        paddingTop: "2rem", // ✅ 위쪽 여백 확보
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start", // ✅ 상단 정렬
        background: "#f9f9f9",
        zIndex: 10,
      }}
    >
      {/* userId를 FreeBoardForm에 prop으로 전달 */}
      <FreeBoardForm userId={userId} />
    </div>
  );
};

export default FreeBoardWritePage;
