import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "shared/lib/auth";
import LogHeader from "widgets/LogHeader/LogHeader";
import axios from "axios";
import RecordCard from "widgets/record/RecordCard";
import Grid from "@mui/material/Grid";
import { Box, Button } from "@mui/material";
import greenSpot from "shared/assets/images/green_spot.png";
import GreenButton from "shared/ui/greenButton";

const NotLoggedIn = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="100%"
    width="100%"
    bgcolor="transparent"
    borderRadius={3}
    p={4}
    position="relative"
  >
    <Box
      position="relative"
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      {/* 이미지 */}
      <img
        src={greenSpot}
        alt="로그인 안내"
        style={{
          width: "60%",
          maxWidth: "60%",
          height: "auto",
          objectFit: "contain",
          opacity: 0.9,
          display: "block",
        }}
      />

      {/* 텍스트와 버튼 겹쳐 표시 */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        sx={{
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            color: "#f5f7f0",
            fontWeight: 400,
            fontSize: "1.3rem",
            textShadow: "0 2px 6px #000000",
            mb: 2,
            lineHeight: 1.6,
          }}
        >
          당신의 발자국을 기록할 수 있어요.
          <br />
          로그인 후, 첫 번째 이야기를 남겨보세요 💬
        </Box>
        <GreenButton
          onClick={() => (window.location.href = "/login")}
          style={{
            color: "#8cac7f",
            fontSize: "1.3rem",
            background: "#f5f5f5",
            padding: "0.7rem 2.2rem",
            marginTop: "1.1rem",
          }}
        >
          로그인 하러가기
        </GreenButton>
      </Box>
    </Box>
  </Box>
);

const LogViewPage = () => {
  const [sortOption, setSortOption] = useState("latest");
  const [records, setRecords] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.userId) {
      setUserId(userInfo.userId);
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

  // 로그인 안한 경우 안내창만 보여줌
  if (!userId) return <NotLoggedIn />;

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
