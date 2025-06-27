import { Box, useTheme, useMediaQuery } from "@mui/material";
import SoftInput from "shared/ui/SoftInput";
import SearchIcon from "@mui/icons-material/Search";

const FreeBoardSearchSection = ({
  searchField,
  setSearchField,
  searchKeyword,
  setSearchKeyword,
  sort,
  setSort,
  page = 0,
  size = 10,
  onSearch, // 검색 실행 함수
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        sort,
        field: searchField,
        keyword: searchKeyword,
        page,
        size,
      });
    }
  };

  return (
    <Box
      mt={{ xs: 2, md: 3 }}
      mb={{ xs: 3, md: 4 }}
      px={{ xs: 1, md: 2 }}
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", md: "center" }}
      gap={{ xs: 2, md: 2 }}
    >
      {/* 상단 필터 영역 (모바일에서는 세로 배치) */}
      <Box
        display="flex"
        flexDirection={{ xs: "row", md: "row" }}
        gap={{ xs: 1, md: 2 }}
        width={{ xs: "100%", md: "auto" }}
      >
        {/* 정렬 기준 */}
        <Box
          flex={{ xs: "1 1 50%", md: "0 0 160px" }}
          minWidth={{ xs: "0", md: "120px" }}
          maxWidth={{ xs: "50%", md: "200px" }}
        >
          <select
            style={{
              width: "100%",
              height: isMobile ? "44px" : "48px",
              padding: "0 1rem",
              borderRadius: "12px",
              border: "1px solid #d0d0d0",
              background: "#fdfdfd",
              fontWeight: "bold",
              fontSize: isMobile ? "0.95rem" : "1rem",
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
            }}
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="popular">인기순</option>
          </select>
        </Box>

        {/* 검색 필터 */}
        <Box
          flex={{ xs: "1 1 50%", md: "0 0 160px" }}
          minWidth={{ xs: "0", md: "120px" }}
          maxWidth={{ xs: "50%", md: "200px" }}
        >
          <select
            style={{
              width: "100%",
              height: isMobile ? "44px" : "48px",
              padding: "0 1rem",
              borderRadius: "12px",
              border: "1px solid #d0d0d0",
              background: "#fdfdfd",
              fontWeight: "bold",
              fontSize: isMobile ? "0.95rem" : "1rem",
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
            value={searchField}
            onChange={(e) => {
              setSearchField(e.target.value);
            }}
          >
            <option value="all">전체</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
        </Box>
      </Box>

      {/* 검색창 */}
      <Box
        flex={{ xs: "none", md: "2 1 0" }}
        minWidth={{ xs: "100%", md: "220px" }}
        width={{ xs: "100%", md: "auto" }}
      >
        <SoftInput
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          icon={{ component: <SearchIcon />, direction: "right" }}
          size="large"
          style={{
            fontSize: isMobile ? "1rem" : "1.2rem",
            py: isMobile ? 1.5 : 2,
            px: isMobile ? 2 : 3,
            height: isMobile ? "44px" : "auto",
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

export default FreeBoardSearchSection;
