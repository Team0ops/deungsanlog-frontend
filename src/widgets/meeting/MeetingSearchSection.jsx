import { Box } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import SoftInput from "shared/ui/SoftInput";
import SearchIcon from "@mui/icons-material/Search";

const MeetingSearchSection = ({
  filter,
  setFilter,
  searchKeyword,
  setSearchKeyword,
}) => {
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
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(e, newFilter) => newFilter && setFilter(newFilter)}
        aria-label="모집 상태 필터"
        sx={{ flexWrap: "nowrap" }}
      >
        <ToggleButton value="all">전체</ToggleButton>
        <ToggleButton value="open">모집중</ToggleButton>
        <ToggleButton value="closed">마감</ToggleButton>
      </ToggleButtonGroup>
      {/* 검색 입력창 */}
      <Box flex={1} minWidth="220px">
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
          onIconClick={() => {
            if (searchKeyword.trim()) {
              // 검색 실행 함수 호출
              console.log("검색:", searchKeyword.trim());
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (searchKeyword.trim()) {
                console.log("검색(엔터):", searchKeyword.trim());
              }
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default MeetingSearchSection;
