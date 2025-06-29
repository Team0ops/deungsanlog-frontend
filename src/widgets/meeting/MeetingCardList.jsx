import { Box, Pagination, useTheme, useMediaQuery } from "@mui/material";
import MeetingCard from "./MeetingCard";

const MeetingCardList = ({
  meetings,
  page,
  totalPages,
  onPageChange,
  loading,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
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
        gap={isMobile ? 1.5 : 1.2}
        mb={isMobile ? 2 : 2.5}
      >
        {loading ? (
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
            🐿️ 모임을 열심히 찾고 있어요...
          </Box>
        ) : meetings && meetings.length > 0 ? (
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
            산속엔 아직 아무도 없네요! 🏞️ <br />
            새로운 모임을 직접 만들어보는 건 어때요?
          </Box>
        )}
      </Box>

      {/* 페이징 */}
      {totalPages > 1 && (
        <Box
          display="flex"
          justifyContent="center"
          mt={isMobile ? 1.5 : 2}
          pb={isMobile ? 3 : 2}
        >
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, value) => onPageChange(value - 1)}
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
      )}
    </Box>
  );
};

export default MeetingCardList;
