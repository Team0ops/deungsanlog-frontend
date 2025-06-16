import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LogWriteForm from "./form/LogWriteForm";
import axios from "axios";
import { getUserInfo, requireAuth } from "shared/lib/auth";

const LogEditPage = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false); // ✅

  useEffect(() => {
    const ok = requireAuth("기록 수정을 위해 로그인이 필요합니다. 로그인하시겠습니까?");
    if (!ok) {
      setIsBlocked(true); // ✅ 렌더링 차단
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

  useEffect(() => {
    if (!recordId || !userId) return;
    axios
      .get(`http://localhost:8080/record-service/record/${recordId}`)
      .then((res) => setRecord(res.data))
      .catch((err) => {
        console.error("기록 불러오기 실패", err);
        alert("기록을 불러오지 못했습니다.");
        navigate("/log");
      });
  }, [recordId, userId, navigate]);

  if (isBlocked || !record) return null; // ✅ 렌더링 차단

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
      <LogWriteForm
        userId={userId}
        initialMountain={
          typeof record.mountain === "object"
            ? record.mountain
            : { id: record.mountainId, name: record.mountainName, location: "" }
        }
        initialDate={record.recordDate}
        initialContent={record.content}
        initialPhoto={
          record.photoUrl
            ? `http://localhost:8080/record-service${record.photoUrl}`
            : null
        }
        onSubmit={async (formData) => {
          try {
            await axios.put(
              `http://localhost:8080/record-service/record/${recordId}`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            alert("기록 수정 완료!");
            navigate("/log");
          } catch (err) {
            console.error("수정 실패", err);
          }
        }}
        isEdit={true}
        recordId={record.id}
      />
    </div>
  );
};

export default LogEditPage;
