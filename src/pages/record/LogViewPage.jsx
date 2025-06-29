import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { getUserInfo } from "shared/lib/auth";
import LogHeader from "widgets/LogHeader/LogHeader";
import axiosInstance from "shared/lib/axiosInstance";
import RecordCard from "widgets/record/RecordCard";
import Grid from "@mui/material/Grid";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import GreenButton from "shared/ui/greenButton";
import Pagination from "@mui/material/Pagination";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const NotLoggedIn = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      width="100%"
      maxWidth="600px"
      mx="auto"
      bgcolor="#f8f9fa"
      borderRadius={3}
      p={isMobile ? 3 : 4}
      boxShadow="0 2px 8px rgba(0,0,0,0.1)"
      border="1px solid #e9ecef"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        maxWidth="400px"
        width="100%"
      >
        <Box
          sx={{
            color: "#495057",
            fontWeight: 500,
            fontSize: isMobile ? "1.1rem" : "1.3rem",
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          당신의 발자국을 기록할 수 있어요.
          <br />
          로그인 후, 첫 번째 이야기를 남겨보세요.
        </Box>
        <GreenButton
          onClick={() => (window.location.href = "/login")}
          style={{
            color: "#8cac7f",
            fontSize: isMobile ? "1rem" : "1.2rem",
            background: "#f5f5f5",
            padding: isMobile ? "0.8rem 2rem" : "1rem 2.5rem",
            whiteSpace: "nowrap",
            border: "1px solid #dee2e6",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          로그인 하러가기
        </GreenButton>
      </Box>
    </Box>
  );
};

const LogViewPage = () => {
  const [sortOption, setSortOption] = useState("latest");
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
          size: isMobile ? 4 : 6,
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
  }, [userId, sortOption, page, isMobile]);

  if (!userId) return <NotLoggedIn />;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      px={isMobile ? 1 : 2}
    >
      <LogHeader
        userId={userId}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <br />
      <Grid
        container
        spacing={isMobile ? 2 : 3}
        justifyContent="center"
        width="100%"
        alignItems="flex-start"
        mt={isMobile ? 1 : 2}
      >
        {records.map((record) => (
          <Grid
            item
            key={record.id}
            xs={12}
            sm={6}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
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
      <Box
        display="flex"
        justifyContent="center"
        mt={isMobile ? 3 : 4}
        width="100%"
        px={isMobile ? 1 : 0}
      >
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(_, value) => setPage(value - 1)}
          color="primary"
          shape="rounded"
          size={isMobile ? "medium" : "large"}
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={isMobile ? 1 : 1}
          showFirstButton={!isMobile}
          showLastButton={!isMobile}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#356849",
              fontWeight: 600,
              borderRadius: "24px !important",
              outline: "none",
              fontSize: isMobile ? "0.875rem" : "1rem",
              minWidth: isMobile ? "32px" : "40px",
              height: isMobile ? "32px" : "40px",
            },
            "& .Mui-selected": {
              backgroundColor: "#bfccb185 !important",
              color: "#143622 !important",
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
