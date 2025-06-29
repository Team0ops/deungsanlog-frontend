import { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  Pagination,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Grid,
  Button,
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
  const [activeTab, setActiveTab] = useState(0); // 0: 참여한 모임, 1: 개설한 모임

  // 필터링 상태
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("latest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const userInfo = getUserInfo();
  const isLoggedIn = !!userInfo?.userId;
  const MEETINGS_PER_PAGE = 4;

  // 상태 옵션
  const statusOptions = [
    { value: "all", label: "전체" },
    { value: "OPEN", label: "모집중" },
    { value: "CANCELLED", label: "취소" },
    { value: "CLOSED", label: "마감" },
  ];

  // 정렬 옵션
  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "oldest", label: "오래된순" },
    { value: "deadline", label: "마감일순" },
  ];

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
        console.log(
          "현재 탭:",
          activeTab === 0 ? "참여한 모임" : "개설한 모임"
        );

        let meetingIds = [];

        if (activeTab === 0) {
          // 참여한 모임 조회
          const idsResponse = await axiosInstance.get(
            `/meeting-service/my-meeting-ids?userId=${userInfo.userId}`
          );
          meetingIds = idsResponse.data;
          console.log("참여한 모임 ID들:", meetingIds);
        } else {
          // 개설한 모임 조회
          const idsResponse = await axiosInstance.get(
            `/meeting-service/my-hosted-meeting-ids?userId=${userInfo.userId}`
          );
          meetingIds = idsResponse.data;
          console.log("개설한 모임 ID들:", meetingIds);
        }

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

        // 3. 상태 필터링
        let filteredMeetings = meetingData;
        if (statusFilter !== "all") {
          filteredMeetings = meetingData.filter(
            (meeting) => meeting.status === statusFilter
          );
        }

        // 4. 날짜 필터링
        if (startDate) {
          filteredMeetings = filteredMeetings.filter(
            (meeting) => meeting.scheduledDate >= startDate
          );
        }
        if (endDate) {
          filteredMeetings = filteredMeetings.filter(
            (meeting) => meeting.scheduledDate <= endDate
          );
        }

        // 5. 정렬
        switch (sortOption) {
          case "oldest":
            filteredMeetings.sort((a, b) => {
              const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
              const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
              return dateA - dateB;
            });
            break;
          case "deadline":
            filteredMeetings.sort((a, b) => {
              const dateA = new Date(a.deadlineDate);
              const dateB = new Date(b.deadlineDate);
              return dateA - dateB;
            });
            break;
          case "latest":
          default:
            filteredMeetings.sort((a, b) => {
              const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
              const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
              return dateB - dateA;
            });
            break;
        }

        // 6. 페이지네이션 계산
        const totalPagesCount = Math.ceil(
          filteredMeetings.length / MEETINGS_PER_PAGE
        );
        setTotalPages(totalPagesCount);

        // 7. 현재 페이지의 모임들만 설정
        const startIndex = page * MEETINGS_PER_PAGE;
        const endIndex = startIndex + MEETINGS_PER_PAGE;
        const currentPageMeetings = filteredMeetings.slice(
          startIndex,
          endIndex
        );

        setMeetings(currentPageMeetings);
        console.log("필터링된 모임 결과:", currentPageMeetings);
      } catch (error) {
        console.error("❌ 내 모임 조회 실패:", error);
        setMeetings([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchMyMeetings();
  }, [
    isLoggedIn,
    userInfo?.userId,
    page,
    activeTab,
    statusFilter,
    sortOption,
    startDate,
    endDate,
  ]);

  const handlePageChange = (event, newPage) => {
    console.log("📄 페이지 변경:", newPage);
    setPage(newPage - 1); // MUI Pagination은 1부터 시작하므로 -1
  };

  const handleTabChange = (event, newValue) => {
    console.log("📑 탭 변경:", newValue);
    setActiveTab(newValue);
    setPage(0); // 탭 변경 시 첫 페이지로 이동
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
    setPage(0);
  };

  const handleDateChange = (type, value) => {
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setPage(0);
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setSortOption("latest");
    setStartDate("");
    setEndDate("");
    setPage(0);
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

          {/* 탭 */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "#e0e0e0",
              backgroundColor: "transparent",
              borderRadius: "12px 12px 0 0",
              px: 2,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  color: "#666",
                  fontWeight: 600,
                  fontSize: isMobile ? "0.95rem" : "1.05rem",
                  textTransform: "none",
                  minWidth: "auto",
                  padding: isMobile ? "1rem 1.2rem" : "1.2rem 1.8rem",
                  borderRadius: "8px 8px 0 0",
                  marginRight: "4px",
                  transition: "all 0.2s ease-in-out",
                  cursor: "pointer",
                  outline: "none",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                    color: "#4c7559",
                    outline: "none",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-visible": {
                    outline: "none",
                  },
                },
                "& .Mui-selected": {
                  color: "#4c7559",
                  fontWeight: 700,
                  backgroundColor: "transparent",
                  border: "1px solid #e0e0e0",
                  borderBottom: "none",
                  boxShadow: "none",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#4c7559",
                  height: 4,
                  borderRadius: "2px 2px 0 0",
                },
              }}
            >
              <Tab label="참여한 모임" />
              <Tab label="개설한 모임" />
            </Tabs>
          </Box>

          {/* 필터링 UI */}
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "0 0 12px 12px",
              p: 3,
              mb: 3,
              border: "1px solid #e0e0e0",
              borderTop: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* 상태 필터 */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="medium">
                  <InputLabel sx={{ color: "#2d5a3d", fontWeight: 600 }}>
                    상태
                  </InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    label="상태"
                    sx={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      py: 0.5,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4c7559",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4c7559",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#2d5a3d",
                        "&.Mui-focused": {
                          color: "#4c7559",
                        },
                      },
                    }}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* 정렬 옵션 */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="medium">
                  <InputLabel sx={{ color: "#2d5a3d", fontWeight: 600 }}>
                    정렬
                  </InputLabel>
                  <Select
                    value={sortOption}
                    onChange={handleSortOptionChange}
                    label="정렬"
                    sx={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      py: 0.5,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4c7559",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4c7559",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#2d5a3d",
                        "&.Mui-focused": {
                          color: "#4c7559",
                        },
                      },
                    }}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* 시작 날짜 */}
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  type="date"
                  label="시작일"
                  value={startDate}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  size="medium"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    sx: { color: "#2d5a3d", fontWeight: 600 },
                  }}
                  sx={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    py: 0.5,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4c7559",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4c7559",
                    },
                  }}
                />
              </Grid>

              {/* 종료 날짜 */}
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  type="date"
                  label="종료일"
                  value={endDate}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                  size="medium"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    sx: { color: "#2d5a3d", fontWeight: 600 },
                  }}
                  sx={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    py: 0.5,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4c7559",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4c7559",
                    },
                  }}
                />
              </Grid>

              {/* 필터 초기화 버튼 */}
              <Grid item xs={12} sm={12} md={2}>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  size="medium"
                  fullWidth
                  sx={{
                    color: "#2d5a3d",
                    borderColor: "transparent",
                    borderWidth: "0px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    fontWeight: 600,
                    textTransform: "none",
                    py: 1.2,
                    outline: "none",
                    "&:hover": {
                      borderColor: "transparent",
                      backgroundColor: "#f0f8f0",
                      color: "#1a3d2a",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                    "&:focus-visible": {
                      outline: "none",
                    },
                  }}
                >
                  필터 초기화
                </Button>
              </Grid>
            </Grid>
          </Box>

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
                  {activeTab === 0 ? (
                    <>
                      아직 참여한 모임이 없어요! 🏞️ <br />
                      새로운 모임에 참가해보는 건 어때요?
                    </>
                  ) : (
                    <>
                      아직 개설한 모임이 없어요! 🏔️ <br />
                      새로운 모임을 만들어보는 건 어때요?
                    </>
                  )}
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
