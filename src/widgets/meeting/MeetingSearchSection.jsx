import { Box } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import SoftInput from "shared/ui/SoftInput";
import SearchIcon from "@mui/icons-material/Search";

// ✅ ToggleButton 공통 스타일 정의
const toggleButtonStyle = {
  outline: "none",
  boxShadow: "none",
  color: "#333",
  background: "#fff",
  transition: "border-color 0.15s, background 0.15s",
  "&:hover": {
    border: "1px solid #e0e0e0",
    background: "#f7faf7",
    outline: "none",
    boxShadow: "none",
  },
  "&:focus": {
    border: "1px solid #e0e0e0",
    outline: "none",
    boxShadow: "none",
  },
  "&:focus-visible": {
    border: "1px solid #e0e0e0",
    outline: "none",
    boxShadow: "none",
  },
  "&.Mui-selected": {
    backgroundColor: "#70a784",
    color: "#fff",
    border: "1px solid #4b8161", // 선택된 것만 진초록 테두리
    "&:hover": {
      backgroundColor: "#5b8e6f",
      border: "2px solid #245e3c",
      outline: "none",
      boxShadow: "none",
    },
  },
};

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
        sx={{
          flexWrap: "nowrap",
          border: "none",
          outline: "none",
          boxShadow: "none",
          "&:focus": {
            outline: "none",
            boxShadow: "none",
          },
          "&:focus-visible": {
            outline: "none",
            boxShadow: "none",
          },
        }}
      >
        <ToggleButton value="all" sx={toggleButtonStyle}>
          전체
        </ToggleButton>
        <ToggleButton value="open" sx={toggleButtonStyle}>
          모집중
        </ToggleButton>
        <ToggleButton value="closed" sx={toggleButtonStyle}>
          마감
        </ToggleButton>
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
