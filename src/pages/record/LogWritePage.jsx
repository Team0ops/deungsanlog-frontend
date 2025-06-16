import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogWriteForm from "./form/LogWriteForm";
import { getUserInfo, requireAuth } from "shared/lib/auth";

const LogWritePage = () => {
  const [userId, setUserId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false); // ✅
  const navigate = useNavigate();

  useEffect(() => {
    const ok = requireAuth("기록 작성을 위해 로그인이 필요합니다. 로그인하시겠습니까?");
    if (!ok) {
      setIsBlocked(true);
      return;
    }

    const userInfo = getUserInfo();
    if (userInfo?.userId) {
      setUserId(userInfo.userId);
    } else {
      alert("사용자 정보를 불러올 수 없습니다.");
      navigate("/login");
    }
  }, []);

  if (isBlocked || !userId) return null; // ✅ 렌더링 차단

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
      background: "transparent",
    }}>
      <LogWriteForm userId={userId} />
    </div>
  );
};

export default LogWritePage;
