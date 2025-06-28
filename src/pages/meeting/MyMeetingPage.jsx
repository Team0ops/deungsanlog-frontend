import { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  Pagination,
} from "@mui/material";
import axiosInstance from "shared/lib/axiosInstance";
import { getUserInfo } from "shared/lib/auth";
import MeetingCard from "widgets/meeting/MeetingCard";
import MyMeetingHeader from "widgets/meeting/MyMeetingHeader";
import LoginRequiredModal from "shared/components/LoginRequiredModal";
import { useNavigate } from "react-router-dom";

const MyMeetingPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const userInfo = getUserInfo();
  const isLoggedIn = !!userInfo?.userId;
  const MEETINGS_PER_PAGE = 4;

  useEffect(() => {
    console.log("MyMeetingPage 로드됨");
    console.log("로그인 상태:", isLoggedIn);
    console.log("사용자 정보:", userInfo);

    if (!isLoggedIn) {
      setShowLoginModal(true);
      setLoading(false);
      return;
    }

    const fetchMyMeetings = async () => {
      try {
        console.log("내 모임 조회 시작");
        // 1. 내가 참여한 모임 ID 목록 가져오기
        const idsResponse = await axiosInstance.get(
          `/meeting-service/my-meeting-ids?userId=${userInfo.userId}`
        );
        const meetingIds = idsResponse.data;
        console.log("참여한 모임 ID들:", meetingIds);

        if (meetingIds.length === 0) {
          setMeetings([]);
          setTotalPages(1);
          setLoading(false);
          return;
        }

        // 2. 각 모임의 상세 정보 가져오기
        const meetingPromises = meetingIds.map((meetingId) =>
          axiosInstance.get(`/meeting-service/${meetingId}`)
        );

        const meetingResponses = await Promise.all(meetingPromises);
        const meetingData = meetingResponses.map((response) => response.data);

        // 3. 날짜순으로 정렬 (최신순)
        const sortedMeetings = meetingData.sort((a, b) => {
          const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
          const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
          return dateB - dateA;
        });

        // 4. 페이지네이션 계산
        const totalPagesCount = Math.ceil(
          sortedMeetings.length / MEETINGS_PER_PAGE
        );
        setTotalPages(totalPagesCount);

        // 5. 현재 페이지의 모임들만 설정
        const startIndex = page * MEETINGS_PER_PAGE;
        const endIndex = startIndex + MEETINGS_PER_PAGE;
        const currentPageMeetings = sortedMeetings.slice(startIndex, endIndex);

        setMeetings(currentPageMeetings);
      } catch (error) {
        console.error("❌ 내 모임 조회 실패:", error);
        setMeetings([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchMyMeetings();
  }, [isLoggedIn, userInfo?.userId, page]);

  const handlePageChange = (event, newPage) => {
    console.log("📄 페이지 변경:", newPage);
    setPage(newPage - 1); // MUI Pagination은 1부터 시작하므로 -1
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <div
        style={{
          minWidth: "90%",
          maxWidth: "100%",
          minHeight: "40vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "transparent",
          borderRadius: "20px",
          padding: isMobile
            ? "clamp(0.8rem, 3vw, 1rem)"
            : "clamp(1rem, 4vw, 1.5rem)",
          position: "relative",
          height: "calc(100vh - 40px)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "1rem" : "1.2rem",
            height: "100%",
          }}
        >
          {/* 헤더 */}
          <MyMeetingHeader />

          {/* 모임 리스트 */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              minHeight: 0,
              paddingRight: "2px",
              position: "relative",
            }}
          >
            {/* 아래쪽 블러 */}
            <div
              style={{
                position: "sticky",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "32px",
                zIndex: 20,
                pointerEvents: "none",
                backdropFilter: "blur(6px)",
              }}
            />

            {/* 모임 카드 리스트 */}
            <Box
              display="flex"
              flexDirection="column"
              gap={isMobile ? 1.5 : 2}
              mb={isMobile ? 2 : 3}
            >
              {meetings && meetings.length > 0 ? (
                meetings.map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))
              ) : (
                <Box
                  width="100%"
                  textAlign="center"
                  color="#888"
                  py={isMobile ? 4 : 6}
                  sx={{
                    fontSize: isMobile ? "clamp(0.9rem, 3vw, 1rem)" : "inherit",
                    fontFamily: "'GmarketSansMedium', sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  아직 참여한 모임이 없어요! 🏞️ <br />
                  새로운 모임에 참가해보는 건 어때요?
                </Box>
              )}
            </Box>

            {/* 페이징 */}
            <Box
              display="flex"
              justifyContent="center"
              mt={isMobile ? 1.5 : 2}
              pb={isMobile ? 1 : 2}
            >
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
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
                    fontSize: isMobile ? "0.9rem" : "1rem",
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
          </Box>
        </div>
      </div>

      {/* 로그인 필요 모달 */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={handleCloseModal}
        onLogin={handleLogin}
        title="로그인이 필요한 서비스입니다"
        message="나의 모임 참여 현황을 보려면\n로그인이 필요해요!"
      />
    </>
  );
};

export default MyMeetingPage;
