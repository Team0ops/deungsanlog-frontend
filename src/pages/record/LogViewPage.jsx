import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, requireAuth } from "shared/lib/auth"; // 인증 관련
import LogHeader from "widgets/LogHeader/LogHeader";
import axios from "axios";
import RecordCard from "widgets/record/RecordCard";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";

const LogViewPage = () => {
  const [sortOption, setSortOption] = useState("latest");
  const [records, setRecords] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false); // ✅ 렌더링 차단용
  const navigate = useNavigate();

  useEffect(() => {
    const ok = requireAuth("기록 조회를 위해 로그인이 필요합니다. 로그인하시겠습니까?");
    if (!ok) {
      setIsBlocked(true); // ✅ 인증 실패시 차단
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
    if (!userId) return;
    axios
      .get(`http://localhost:8080/record-service/get?userId=${userId}`)
      .then((res) => {
        const sorted = [...res.data].sort((a, b) => {
          return sortOption === "latest"
            ? new Date(b.recordDate) - new Date(a.recordDate)
            : new Date(a.recordDate) - new Date(b.recordDate);
        });
        setRecords(sorted);
      })
      .catch((err) => console.error("기록 불러오기 실패", err));
  }, [userId, sortOption]);

  // ✅ 인증 실패 시 아무 것도 렌더링하지 않음
  if (isBlocked) return null;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <LogHeader
        userId={userId}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <br />
      <Grid
        container
        spacing={3}
        justifyContent="center"
        width="100%"
        alignItems="flex-start"
        mt={2}
        ml={-10}
      >
        {records.map((record) => (
          <Grid item key={record.id}>
            <RecordCard
              recordId={record.id}
              image={
                record.photoUrl
                  ? `http://localhost:8080/record-service${record.photoUrl}`
                  : "/default-image.png"
              }
              mountainName={record.mountainName}
              date={record.recordDate}
              content={record.content}
              onEdit={() => navigate(`/log/edit/${record.id}`)}
              onDeleted={() => {
                setRecords((prev) => prev.filter((r) => r.id !== record.id));
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LogViewPage;
