import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { getUserInfo } from "shared/lib/auth";
import LogHeader from "widgets/LogHeader/LogHeader";
import axiosInstance from "shared/lib/axiosInstance";
import RecordCard from "widgets/record/RecordCard";
import Grid from "@mui/material/Grid";
import { Box, Button } from "@mui/material";
import greenSpot from "shared/assets/images/green_spot.png";
import GreenButton from "shared/ui/greenButton";
import Pagination from "@mui/material/Pagination";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
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

    axiosInstance
      .get(`/record-service/get`, {
        params: {
          userId,
          page,
          size: 6,
        },
      })
      .then((res) => {
        const { content, totalPages } = res.data;

        const sorted = [...content].sort((a, b) => {
          return sortOption === "latest"
            ? new Date(b.recordDate) - new Date(a.recordDate)
            : new Date(a.recordDate) - new Date(b.recordDate);
        });

        setRecords(sorted);
        setTotalPages(totalPages);
      })
      .catch((err) => console.error("기록 불러오기 실패", err));
  }, [userId, sortOption, page]);

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
      >
        {records.map((record) => (
          <Grid item key={record.id} xs={12} sm={6} md={4}>
            <RecordCard
              recordId={record.id}
              image={
                record.photoUrl
                  ? `${baseUrl}/record-service${record.photoUrl}`
                  : "/default-image.png"
              }
              mountainName={record.mountainName}
              date={record.recordDate}
              content={record.content}
              onEdit={() => navigate(`/log/edit/${record.id}`)}
              onClick={() => navigate(`/log/detail/${record.id}`)}
              onDeleted={() => {
                setRecords((prev) => prev.filter((r) => r.id !== record.id));
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* 페이지네이션 버튼 */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(_, value) => setPage(value - 1)}
          color="primary"
          shape="rounded"
          size="large"
          siblingCount={1}
          boundaryCount={1}
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#356849", // 기본 텍스트 색상
              fontWeight: 600,
              borderRadius: "24px !important",
              outline: "none",
            },
            "& .Mui-selected": {
              backgroundColor: "#bfccb185 !important", // 선택된 버튼 배경
              color: "#143622 !important", // 선택된 버튼 텍스트
              border: "none",
              borderRadius: "24px !important",
              outline: "none",
            },
            "& .MuiPaginationItem-root:hover": {
              backgroundColor: "#b5b9ae1c",
              borderRadius: "24px !important",
              outline: "none",
            },
          }}
        />
      </Box>

      <Outlet />
    </Box>
  );
};

export default LogViewPage;
