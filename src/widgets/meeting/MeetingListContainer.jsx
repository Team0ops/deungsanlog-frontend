// 상위 컴포넌트에서 검색 및 페이징 처리
import { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import MeetingSearchSection from "./MeetingSearchSection";
import MeetingCardList from "./MeetingCardList";
import axiosInstance from "shared/lib/axiosInstance";

const MeetingListContainer = () => {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("deadline");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchMeetings = ({ status, sort, keyword, page }) => {
    setLoading(true);
    console.log("🔍 모임 검색 요청:", { status, sort, keyword, page });

    axiosInstance
      .get("/meeting-service/search", {
        params: { status, sort, keyword, page, size: 2 },
      })
      .then((res) => {
        console.log("✅ 모임 검색 응답:", res.data);
        setMeetings(res.data.meetings || []);
        setTotalPages(res.data.totalPages || 1);
        setPage(page);
        console.log("📊 페이지네이션 정보:", {
          totalPages: res.data.totalPages,
          currentPage: page,
          contentLength: res.data.meetings?.length,
        });
      })
      .catch((error) => {
        console.error("❌ 모임 목록 조회 실패:", error);
        setMeetings([]);
        setTotalPages(1);
        setPage(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMeetings({ status: filter, sort, keyword: searchKeyword, page });
    // eslint-disable-next-line
  }, []);

  const handleSearch = ({ status, sort, keyword, page }) => {
    fetchMeetings({ status, sort, keyword, page });
  };

  const handlePageChange = (newPage) => {
    console.log("📄 페이지 변경:", newPage);
    fetchMeetings({
      status: filter,
      sort,
      keyword: searchKeyword,
      page: newPage,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "0.5rem" : "0.8rem",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <MeetingSearchSection
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        onSearch={handleSearch}
      />
      <MeetingCardList
        meetings={meetings}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
};

export default MeetingListContainer;
