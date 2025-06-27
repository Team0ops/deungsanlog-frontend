import { Box, Button } from "@mui/material";

const VisitorView = ({ onApply }) => {
  return (
    <Box>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={onApply}
      >
        참가 신청하기
      </Button>
    </Box>
  );
};

export default VisitorView;
