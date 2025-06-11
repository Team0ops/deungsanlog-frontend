import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LogWriteForm from "./form/LogWriteForm";
import axios from "axios";

const LogEditPage = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const userId = 11;

  useEffect(() => {
    axios
      .get(`http://localhost:8080/record-service/record/${recordId}`)
      .then((res) => setRecord(res.data))
      .catch((err) => {
        console.error("기록 불러오기 실패", err);
        alert("기록을 불러오지 못했습니다.");
        navigate("/log");
      });
  }, [recordId, navigate]); // navigate도 의존성 배열에 추가

  const handleEditSubmit = async (formData) => {
    try {
      await axios.put(
        `http://localhost:8080/record-service/record/${recordId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("기록 수정 완료!");
      navigate("/log");
    } catch (err) {
      console.error("수정 실패", err);
    }
  };

  if (!record) return <div>로딩 중...</div>;

  return (
    <div
      style={{
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
      }}
    >
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
        onSubmit={handleEditSubmit}
        isEdit={true}
        recordId={record.id} // 반드시 넘겨주세요!
      />
    </div>
  );
};

export default LogEditPage;
