import { Box } from "@mui/material";
import SoftInput from "shared/ui/SoftInput";
import SearchIcon from "@mui/icons-material/Search";

const MeetingSearchSection = ({
  filter,
  setFilter,
  searchKeyword,
  setSearchKeyword,
  sort,
  setSort,
  onSearch, // 검색 실행 함수 (props로 전달)
}) => {
  // 검색 실행 핸들러
  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        status: filter,
        sort,
        keyword: searchKeyword,
        page: 0,
      });
    }
  };

  return (
    <Box
      mt={3}
      mb={4}
      px={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
    >
      {/* 모집 상태 필터 */}
      <Box flex="0 0 160px" minWidth="120px" maxWidth="200px">
        <select
          style={{
            width: "100%",
            height: "48px",
            padding: "0 1rem",
            borderRadius: "12px",
            border: "1px solid #d0d0d0",
            background: "#fdfdfd",
            fontWeight: "bold",
            fontSize: "1rem",
            color: "#4c7559",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg fill='Green' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
            backgroundSize: "16px 16px",
          }}
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            // 값이 바뀌면 바로 검색 실행
            if (onSearch) {
              onSearch({
                status: e.target.value,
                sort,
                keyword: searchKeyword,
                page: 0,
              });
            }
          }}
        >
          <option value="all">전체</option>
          <option value="open">모집중</option>
          <option value="closed">마감</option>
          <option value="cancelled">취소</option>
        </select>
      </Box>

      {/* 정렬 기준 */}
      <Box flex="0 0 160px" minWidth="120px" maxWidth="200px">
        <select
          style={{
            width: "100%",
            height: "48px",
            padding: "0 1rem",
            borderRadius: "12px",
            border: "1px solid #d0d0d0",
            background: "#fdfdfd",
            fontWeight: "bold",
            fontSize: "1rem",
            color: "#4c7559",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg fill='Green' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
            backgroundSize: "16px 16px",
          }}
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            // 값이 바뀌면 바로 검색 실행
            if (onSearch) {
              onSearch({
                status: filter,
                sort: e.target.value,
                keyword: searchKeyword,
                page: 0,
              });
            }
          }}
        >
          <option value="deadline">마감 임박순</option>
          <option value="latest">최신순</option>
          <option value="oldest">오래된 순</option>
        </select>
      </Box>

      {/* 검색 입력창 */}
      <Box flex="2 1 0" minWidth="220px">
        <SoftInput
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="모임 제목 또는 산 이름 검색"
          icon={{ component: <SearchIcon />, direction: "right" }}
          size="large"
          style={{
            fontSize: "1.2rem",
            py: 2,
            px: 3,
          }}
          fullWidth
          onIconClick={handleSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default MeetingSearchSection;
