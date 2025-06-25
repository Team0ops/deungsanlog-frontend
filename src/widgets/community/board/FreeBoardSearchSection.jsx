import { Box } from "@mui/material";
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
      mt={3}
      mb={4}
      px={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
    >
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
          }}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="popular">인기순</option>
        </select>
      </Box>

      {/* 검색 필터 */}
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

      {/* 검색창 */}
      <Box flex="2 1 0" minWidth="220px">
        <SoftInput
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
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

export default FreeBoardSearchSection;
