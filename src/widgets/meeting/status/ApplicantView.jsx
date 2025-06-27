import { Box, Typography, Button } from "@mui/material";
const ApplicantView = ({ onCancel }) => {
  return (
    <Box>
      <Typography fontWeight={600} mb={1}>
        신청 대기 중입니다
      </Typography>
      <Button size="small" variant="outlined" color="error" onClick={onCancel}>
        신청 취소
      </Button>
    </Box>
  );
};
export default ApplicantView;
