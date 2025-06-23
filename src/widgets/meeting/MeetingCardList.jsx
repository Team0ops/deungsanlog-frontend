import { Box, Pagination } from "@mui/material";
import MeetingCard from "./MeetingCard";

const MeetingCardList = ({ meetings, page, totalPages, onPageChange }) => {
  return (
    <Box>
      {/* 모임 카드 리스트 */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        justifyContent="center"
        mb={3}
      >
        {meetings && meetings.length > 0 ? (
          meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))
        ) : (
          <Box width="100%" textAlign="center" color="#888" py={6}>
            산속엔 아직 아무도 없네요! 🏞️ <br />
            새로운 모임을 직접 만들어보는 건 어때요?
          </Box>
        )}
      </Box>
      {/* 페이징 */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, value) => onPageChange(value - 1)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default MeetingCardList;
